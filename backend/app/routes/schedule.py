from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db
from app.models.models import ScheduleDB, ScheduleResponse, ProductionOrderDB, MachineDB
from app.services.planning_service import plan_production_order

router = APIRouter(prefix="/api/schedule", tags=["Production Schedule"])

@router.get("", response_model=List[ScheduleResponse])
def get_schedule(db: Session = Depends(get_db)):
    """Fetch active production schedules joined with order and machine info."""
    schedules = db.query(ScheduleDB).all()
    res = []
    for s in schedules:
        order = db.query(ProductionOrderDB).filter(ProductionOrderDB.order_id == s.order_id).first()
        machine = db.query(MachineDB).filter(MachineDB.machine_id == s.machine_id).first()
        res.append(ScheduleResponse(
            schedule_id=s.schedule_id,
            order_id=s.order_id,
            machine_id=s.machine_id,
            machine_name=machine.name if machine else s.machine_id,
            product=order.product if order else "Unknown",
            quantity=order.quantity if order else 0,
            shift=s.shift,
            start_time=s.start_time,
            status=s.status
        ))
    return res

@router.post("/run")
def run_production_planning(db: Session = Depends(get_db)):
    """
    Manually triggers production planning across all un-scheduled / pending / shortage orders.
    """
    pending_orders = db.query(ProductionOrderDB).filter(
        ProductionOrderDB.status.in_(["pending", "material_shortage", "ready_for_scheduling"])
    ).all()

    results = []
    for order in pending_orders:
        res = plan_production_order(db, order)
        results.append(res)

    return {
        "message": f"Planning run executed for {len(pending_orders)} order(s).",
        "results": results
    }
