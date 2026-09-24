import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.models import ProductionOrderDB, InventoryDB, MachineDB, ScheduleDB
from app.services.mock_plm_service import plm_service_instance

SHIFTS = [
    "Shift 1 (08:00 - 16:00)",
    "Shift 2 (16:00 - 00:00)",
    "Shift 3 (00:00 - 08:00)"
]

def plan_production_order(db: Session, order: ProductionOrderDB) -> Dict[str, Any]:
    """
    Core Production Planning Algorithm:
    1. Check inventory available stock (stock_qty - allocated_qty).
    2. Calculate shortage.
    3. If insufficient material:
       - set order status = 'material_shortage'
       - record shortage_qty
    4. If sufficient material:
       - filter machines: exclude maintenance
       - pick least-loaded machine
       - assign available shift
       - set status = 'scheduled'
       - reserve inventory (allocated_qty += quantity)
       - create Schedule entry
       - trigger PLM status sync
    """
    inv = db.query(InventoryDB).filter(InventoryDB.product == order.product).first()
    
    if not inv:
        # Create default inventory entry if missing
        inv = InventoryDB(product=order.product, stock_qty=0, reorder_level=50, allocated_qty=0)
        db.add(inv)
        db.commit()
        db.refresh(inv)

    available_stock = inv.stock_qty - inv.allocated_qty
    required_qty = order.quantity

    # 1. Material Shortage Check
    if available_stock < required_qty:
        shortage = required_qty - max(0, available_stock)
        order.status = "material_shortage"
        order.shortage_qty = shortage
        db.commit()

        # Sync to PLM
        plm_service_instance.sync_order_status(order.order_id, "MATERIAL_SHORTAGE", {"shortage_qty": shortage})

        return {
            "status": "material_shortage",
            "message": f"Material shortage detected: {shortage} units required for {order.product}.",
            "shortage_qty": shortage,
            "available_stock": available_stock,
            "order_id": order.order_id
        }

    # 2. Sufficient Stock -> Select Machine & Schedule
    machines = db.query(MachineDB).filter(MachineDB.status != "maintenance").all()
    if not machines:
        order.status = "ready_for_scheduling"
        db.commit()
        return {
            "status": "ready_for_scheduling",
            "message": "Material available, but all machines are currently in maintenance.",
            "order_id": order.order_id
        }

    # Calculate load per machine (number of active scheduled orders)
    machine_loads = {}
    for m in machines:
        active_count = db.query(ScheduleDB).filter(ScheduleDB.machine_id == m.machine_id, ScheduleDB.status == "scheduled").count()
        machine_loads[m.machine_id] = active_count

    # Select machine with lowest load
    best_machine_id = min(machine_loads, key=machine_loads.get)
    best_machine = db.query(MachineDB).filter(MachineDB.machine_id == best_machine_id).first()

    # Determine next shift
    current_schedules_count = machine_loads[best_machine_id]
    assigned_shift = SHIFTS[current_schedules_count % len(SHIFTS)]
    start_time_str = (datetime.utcnow() + timedelta(hours=current_schedules_count * 8)).strftime("%Y-%m-%d %H:00")

    # Reserve inventory
    inv.allocated_qty += required_qty

    # Create Schedule
    sched_id = f"SCH-{uuid.uuid4().hex[:6].upper()}"
    new_schedule = ScheduleDB(
        schedule_id=sched_id,
        order_id=order.order_id,
        machine_id=best_machine.machine_id,
        shift=assigned_shift,
        start_time=start_time_str,
        status="scheduled"
    )

    # Update order state
    order.status = "scheduled"
    order.shortage_qty = 0

    db.add(new_schedule)
    db.commit()

    # Sync to PLM
    plm_service_instance.sync_order_status(
        order.order_id,
        "SCHEDULED",
        {
            "schedule_id": sched_id,
            "machine_id": best_machine.machine_id,
            "machine_name": best_machine.name,
            "shift": assigned_shift,
            "start_time": start_time_str
        }
    )

    return {
        "status": "scheduled",
        "message": f"Material available. Production scheduled on {best_machine.name} ({assigned_shift}).",
        "order_id": order.order_id,
        "schedule_id": sched_id,
        "machine": best_machine.name,
        "shift": assigned_shift
    }


def process_inventory_restock(db: Session, product: str) -> List[Dict[str, Any]]:
    """
    AUTOMATIC RESTOCK TRIGGER:
    When inventory is updated / restocked:
    If a product previously had status 'material_shortage' and enough stock becomes available:
    material_shortage ---> scheduled automatically!
    """
    updated_orders = []
    
    # Find orders waiting for this product
    pending_orders = db.query(ProductionOrderDB).filter(
        ProductionOrderDB.product == product,
        ProductionOrderDB.status == "material_shortage"
    ).order_by(ProductionOrderDB.created_at.asc()).all()

    for order in pending_orders:
        res = plan_production_order(db, order)
        if res["status"] == "scheduled":
            updated_orders.append({
                "order_id": order.order_id,
                "product": order.product,
                "previous_status": "material_shortage",
                "new_status": "scheduled",
                "machine": res.get("machine"),
                "shift": res.get("shift")
            })

    return updated_orders
