import uuid
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.models import ProductionOrderDB, OrderCreate, OrderResponse, InventoryDB, ScheduleDB
from app.services.extraction_service import extract_order_from_document
from app.services.planning_service import plan_production_order
from app.services.mock_plm_service import plm_service_instance

router = APIRouter(prefix="/api/orders", tags=["Production Orders"])

@router.get("", response_model=List[OrderResponse])
def get_orders(db: Session = Depends(get_db)):
    """Fetch all production orders."""
    return db.query(ProductionOrderDB).order_by(ProductionOrderDB.created_at.desc()).all()

@router.post("", response_model=OrderResponse)
def create_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    """Manually create a new production order and trigger production planning."""
    order_id = order_data.order_id or f"ORD-{uuid.uuid4().hex[:6].upper()}"
    
    # Check duplicate
    existing = db.query(ProductionOrderDB).filter(ProductionOrderDB.order_id == order_id).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Order ID {order_id} already exists.")

    new_order = ProductionOrderDB(
        order_id=order_id,
        product=order_data.product,
        quantity=order_data.quantity,
        due_date=order_data.due_date,
        source_file=order_data.source_file or "Manual Entry",
        status="pending"
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    # Run planning engine
    plan_production_order(db, new_order)
    db.refresh(new_order)
    return new_order

@router.post("/upload")
def upload_order_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    AI Document Upload Endpoint.
    Supports CSV, XLSX, PDF, and image files.
    Parses metadata and extracts Order ID, Product, Quantity, Due Date, Material.
    Reports missing fields explicitly.
    """
    file_bytes = file.file.read()
    extraction = extract_order_from_document(file_bytes, file.filename)

    # If key fields are present, auto-create order
    auto_created = False
    created_order_id = None
    planning_info = None

    if extraction.order_id and extraction.product and extraction.quantity:
        existing = db.query(ProductionOrderDB).filter(ProductionOrderDB.order_id == extraction.order_id).first()
        if not existing:
            new_order = ProductionOrderDB(
                order_id=extraction.order_id,
                product=extraction.product,
                quantity=extraction.quantity,
                due_date=extraction.due_date or "2026-10-30",
                source_file=file.filename,
                status="pending"
            )
            db.add(new_order)
            db.commit()
            db.refresh(new_order)
            
            planning_info = plan_production_order(db, new_order)
            auto_created = True
            created_order_id = new_order.order_id

    return {
        "filename": file.filename,
        "extraction": extraction.model_dump(),
        "auto_created": auto_created,
        "created_order_id": created_order_id,
        "planning_result": planning_info
    }

@router.put("/{order_id}/complete")
def complete_order(order_id: str, db: Session = Depends(get_db)):
    """Mark an order as completed, freeing allocated machine capacity and inventory."""
    order = db.query(ProductionOrderDB).filter(ProductionOrderDB.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail=f"Order {order_id} not found.")

    order.status = "completed"

    # Deallocate inventory
    inv = db.query(InventoryDB).filter(InventoryDB.product == order.product).first()
    if inv and inv.allocated_qty >= order.quantity:
        inv.allocated_qty -= order.quantity
        inv.stock_qty = max(0, inv.stock_qty - order.quantity)

    # Update schedule status
    schedules = db.query(ScheduleDB).filter(ScheduleDB.order_id == order_id).all()
    for s in schedules:
        s.status = "completed"

    db.commit()

    # Sync to PLM
    plm_service_instance.sync_order_status(order_id, "COMPLETED")
    return {"message": f"Order {order_id} marked as completed.", "status": "completed"}

@router.delete("/{order_id}")
def delete_order(order_id: str, db: Session = Depends(get_db)):
    """Delete a production order."""
    order = db.query(ProductionOrderDB).filter(ProductionOrderDB.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail=f"Order {order_id} not found.")

    # Deallocate inventory if it was scheduled
    if order.status == "scheduled":
        inv = db.query(InventoryDB).filter(InventoryDB.product == order.product).first()
        if inv and inv.allocated_qty >= order.quantity:
            inv.allocated_qty -= order.quantity

    db.delete(order)
    db.commit()
    return {"message": f"Order {order_id} deleted."}
