from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db
from app.models.models import InventoryDB, InventoryCreate, InventoryResponse
from app.services.planning_service import process_inventory_restock

router = APIRouter(prefix="/api/inventory", tags=["Inventory Management"])

@router.get("", response_model=List[InventoryResponse])
def get_inventory(db: Session = Depends(get_db)):
    """Fetch all inventory items with calculated available stock."""
    items = db.query(InventoryDB).all()
    result = []
    for item in items:
        avail = max(0, item.stock_qty - item.allocated_qty)
        result.append(InventoryResponse(
            id=item.id,
            product=item.product,
            stock_qty=item.stock_qty,
            reorder_level=item.reorder_level,
            allocated_qty=item.allocated_qty,
            available_qty=avail
        ))
    return result

@router.post("")
def update_or_create_inventory(payload: InventoryCreate, db: Session = Depends(get_db)):
    """
    Update or Restock Inventory.
    AUTOMATICALLY RESTOCKS & TRIGGERS PLANNING:
    If a product previously had material_shortage and enough stock becomes available,
    material_shortage ---> scheduled automatically!
    """
    item = db.query(InventoryDB).filter(InventoryDB.product == payload.product).first()
    if item:
        item.stock_qty += payload.stock_qty
        if payload.reorder_level:
            item.reorder_level = payload.reorder_level
    else:
        item = InventoryDB(
            product=payload.product,
            stock_qty=payload.stock_qty,
            reorder_level=payload.reorder_level or 50,
            allocated_qty=0
        )
        db.add(item)

    db.commit()
    db.refresh(item)

    # Trigger automatic restock shortage resolution!
    rescheduled_orders = process_inventory_restock(db, payload.product)

    return {
        "message": f"Inventory updated for {payload.product}. Stock now {item.stock_qty}.",
        "product": item.product,
        "stock_qty": item.stock_qty,
        "allocated_qty": item.allocated_qty,
        "available_qty": item.stock_qty - item.allocated_qty,
        "auto_rescheduled_orders": rescheduled_orders
    }
