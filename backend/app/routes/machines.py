from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import MachineDB, MachineResponse, MachineStatusUpdate, ScheduleDB

router = APIRouter(prefix="/api/machines", tags=["Machine Operations"])

@router.get("", response_model=List[MachineResponse])
def get_machines(db: Session = Depends(get_db)):
    """Fetch all production machines with live load metrics."""
    machines = db.query(MachineDB).all()
    res = []
    for m in machines:
        load = db.query(ScheduleDB).filter(ScheduleDB.machine_id == m.machine_id, ScheduleDB.status == "scheduled").count()
        res.append(MachineResponse(
            machine_id=m.machine_id,
            name=m.name,
            type=m.type,
            status=m.status,
            shift_capacity=m.shift_capacity,
            current_load=load
        ))
    return res

@router.put("/{machine_id}/status", response_model=MachineResponse)
def update_machine_status(machine_id: str, payload: MachineStatusUpdate, db: Session = Depends(get_db)):
    """Update machine status (idle, running, maintenance)."""
    valid_statuses = ["idle", "running", "maintenance"]
    if payload.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")

    machine = db.query(MachineDB).filter(MachineDB.machine_id == machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail=f"Machine {machine_id} not found.")

    machine.status = payload.status
    db.commit()
    db.refresh(machine)

    load = db.query(ScheduleDB).filter(ScheduleDB.machine_id == machine_id, ScheduleDB.status == "scheduled").count()
    return MachineResponse(
        machine_id=machine.machine_id,
        name=machine.name,
        type=machine.type,
        status=machine.status,
        shift_capacity=machine.shift_capacity,
        current_load=load
    )
