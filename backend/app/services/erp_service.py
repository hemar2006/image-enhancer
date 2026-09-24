from sqlalchemy.orm import Session
from app.models.models import ProductionOrderDB, InventoryDB, MachineDB, ScheduleDB
from app.services.planning_service import plan_production_order

def seed_database(db: Session):
    """
    Seeds initial demonstration dataset for college PLM/ERP evaluation.
    """
    # 1. Seed Inventory
    initial_inventory = [
        {"product": "Gear", "stock_qty": 600, "reorder_level": 100},
        {"product": "Bolt", "stock_qty": 120, "reorder_level": 50},
        {"product": "Shaft", "stock_qty": 200, "reorder_level": 50},
        {"product": "Valve Body", "stock_qty": 50, "reorder_level": 20}
    ]
    for item in initial_inventory:
        existing = db.query(InventoryDB).filter(InventoryDB.product == item["product"]).first()
        if not existing:
            inv = InventoryDB(
                product=item["product"],
                stock_qty=item["stock_qty"],
                reorder_level=item["reorder_level"],
                allocated_qty=0
            )
            db.add(inv)
    db.commit()

    # 2. Seed Machines
    initial_machines = [
        {"machine_id": "CNC-01", "name": "CNC Milling Station 01", "type": "CNC Mill", "status": "idle", "shift_capacity": 8},
        {"machine_id": "CNC-02", "name": "CNC Turning Center 02", "type": "CNC Lathe", "status": "idle", "shift_capacity": 8},
        {"machine_id": "LATHE-01", "name": "Manual Precision Lathe 01", "type": "Manual Lathe", "status": "idle", "shift_capacity": 8},
        {"machine_id": "ASSEMBLY-01", "name": "Automated Assembly Cell 01", "type": "Assembly Station", "status": "idle", "shift_capacity": 8}
    ]
    for m in initial_machines:
        existing = db.query(MachineDB).filter(MachineDB.machine_id == m["machine_id"]).first()
        if not existing:
            mac = MachineDB(
                machine_id=m["machine_id"],
                name=m["name"],
                type=m["type"],
                status=m["status"],
                shift_capacity=m["shift_capacity"]
            )
            db.add(mac)
    db.commit()

    # 3. Seed Demo Orders & Process Planning
    initial_orders = [
        {"order_id": "ORD-GEAR-101", "product": "Gear", "quantity": 500, "due_date": "2026-10-01", "source_file": "PLM-GEAR-001.step"},
        {"order_id": "ORD-BOLT-102", "product": "Bolt", "quantity": 150, "due_date": "2026-10-05", "source_file": "BOLT_PO_9912.pdf"},
        {"order_id": "ORD-SHAFT-103", "product": "Shaft", "quantity": 100, "due_date": "2026-10-08", "source_file": "PLM-SHAFT-001.step"}
    ]

    for ord_data in initial_orders:
        existing = db.query(ProductionOrderDB).filter(ProductionOrderDB.order_id == ord_data["order_id"]).first()
        if not existing:
            order = ProductionOrderDB(
                order_id=ord_data["order_id"],
                product=ord_data["product"],
                quantity=ord_data["quantity"],
                due_date=ord_data["due_date"],
                source_file=ord_data["source_file"],
                status="pending"
            )
            db.add(order)
            db.commit()
            db.refresh(order)
            
            # Execute planning for order
            plan_production_order(db, order)
