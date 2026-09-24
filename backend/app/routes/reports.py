from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import ProductionOrderDB, InventoryDB, MachineDB, ScheduleDB

router = APIRouter(prefix="/api/reports", tags=["Dashboard Analytics & Reports"])

@router.get("/dashboard")
def get_dashboard_reports(db: Session = Depends(get_db)):
    """
    Returns unified metrics and AI insights for executive manufacturing dashboard.
    """
    total_orders = db.query(ProductionOrderDB).count()
    scheduled_orders = db.query(ProductionOrderDB).filter(ProductionOrderDB.status == "scheduled").count()
    completed_orders = db.query(ProductionOrderDB).filter(ProductionOrderDB.status == "completed").count()
    shortage_orders = db.query(ProductionOrderDB).filter(ProductionOrderDB.status == "material_shortage").count()
    pending_orders = db.query(ProductionOrderDB).filter(ProductionOrderDB.status == "pending").count()

    total_machines = db.query(MachineDB).count()
    maintenance_machines = db.query(MachineDB).filter(MachineDB.status == "maintenance").count()
    active_machines = db.query(MachineDB).filter(MachineDB.status != "maintenance").count()

    # Utilization calculation
    machine_utilization_pct = round(((active_machines - maintenance_machines) / total_machines * 100), 1) if total_machines > 0 else 0

    # Fulfillment rate % (scheduled + completed / total)
    fulfilled = scheduled_orders + completed_orders
    fulfillment_rate_pct = round((fulfilled / total_orders * 100), 1) if total_orders > 0 else 0

    # Status breakdown for Recharts Pie
    order_status_breakdown = [
        {"name": "Scheduled", "value": scheduled_orders, "color": "#10B981"},
        {"name": "Material Shortage", "value": shortage_orders, "color": "#EF4444"},
        {"name": "Completed", "value": completed_orders, "color": "#3B82F6"},
        {"name": "Pending", "value": pending_orders, "color": "#F59E0B"}
    ]

    # Machine workload breakdown for Recharts Bar
    machines = db.query(MachineDB).all()
    machine_loads = []
    for m in machines:
        load = db.query(ScheduleDB).filter(ScheduleDB.machine_id == m.machine_id, ScheduleDB.status == "scheduled").count()
        machine_loads.append({
            "machine_id": m.machine_id,
            "name": m.name,
            "load": load,
            "capacity": m.shift_capacity,
            "status": m.status
        })

    # AI Recommendation Feed Generation
    ai_recommendations = []
    
    # Check shortages
    shortage_list = db.query(ProductionOrderDB).filter(ProductionOrderDB.status == "material_shortage").all()
    for s_ord in shortage_list:
        ai_recommendations.append({
            "type": "warning",
            "title": "Material Shortage Alert",
            "message": f"Material shortage detected: {s_ord.shortage_qty} units required for {s_ord.product} (Order {s_ord.order_id}).",
            "action": "Restock Inventory"
        })

    # Check available scheduling
    scheduled_list = db.query(ProductionOrderDB).filter(ProductionOrderDB.status == "scheduled").all()
    for s_ord in scheduled_list:
        sched = db.query(ScheduleDB).filter(ScheduleDB.order_id == s_ord.order_id).first()
        m_name = sched.machine_id if sched else "CNC Machine"
        shift_name = sched.shift if sched else "Shift 1"
        ai_recommendations.append({
            "type": "success",
            "title": "Production Scheduled",
            "message": f"Material available. Production order {s_ord.order_id} ({s_ord.product}) scheduled on {m_name} during {shift_name}.",
            "action": "View Schedule"
        })

    # Load balancing recommendation
    if machine_loads:
        lowest_loaded = min(machine_loads, key=lambda x: x["load"])
        ai_recommendations.append({
            "type": "info",
            "title": "Machine Load Balancing",
            "message": f"Machine {lowest_loaded['name']} selected for next queue because it has the lowest current load ({lowest_loaded['load']} active jobs).",
            "action": "Optimize Load"
        })

    return {
        "total_orders": total_orders,
        "scheduled_orders": scheduled_orders,
        "completed_orders": completed_orders,
        "material_shortages": shortage_orders,
        "machine_utilization_pct": machine_utilization_pct,
        "fulfillment_rate_pct": fulfillment_rate_pct,
        "order_status_breakdown": order_status_breakdown,
        "machine_loads": machine_loads,
        "ai_recommendations": ai_recommendations[:6]  # Top 6 insights
    }
