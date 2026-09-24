from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db
from app.services.mock_plm_service import plm_service_instance
from app.models.models import ProductionOrderDB
from app.services.planning_service import plan_production_order

router = APIRouter(prefix="/api/plm", tags=["PLM Integration"])

@router.get("/status")
def get_plm_status():
    """Get current PLM connection status and banner metadata."""
    return plm_service_instance.get_status()

@router.get("/products")
def get_plm_products():
    """Get list of all managed PLM products and revisions."""
    return plm_service_instance.get_products()

@router.get("/products/{product_id}")
def get_plm_product_details(product_id: str):
    """Get details for a specific PLM product."""
    prod = plm_service_instance.get_product_details(product_id)
    if not prod:
        raise HTTPException(status_code=404, detail=f"PLM Product {product_id} not found.")
    return prod

@router.get("/products/{product_id}/bom")
def get_plm_product_bom(product_id: str):
    """Get Bill of Materials (BOM) for a PLM product."""
    return plm_service_instance.get_product_bom(product_id)

@router.get("/products/{product_id}/documents")
def get_plm_product_documents(product_id: str):
    """Get CAD documents and specifications for a PLM product."""
    return plm_service_instance.get_product_documents(product_id)

@router.post("/production-request")
def create_plm_production_request(payload: Dict[str, Any], db: Session = Depends(get_db)):
    """
    Submits a PLM design release directly into ERP production order pipeline.
    """
    product_id = payload.get("product_id")
    quantity = payload.get("quantity", 100)
    due_date = payload.get("due_date", "2026-10-15")

    prod = plm_service_instance.get_product_details(product_id)
    if not prod:
        raise HTTPException(status_code=404, detail=f"Product {product_id} not found in PLM.")

    req = plm_service_instance.create_production_request(product_id, quantity, due_date)
    
    # Auto-create ERP Production Order
    order_id = f"ORD-{prod['name'].upper()}-{req['plm_request_id'][-4:]}"
    new_order = ProductionOrderDB(
        order_id=order_id,
        product=prod["name"],
        quantity=quantity,
        due_date=due_date,
        source_file=f"PLM Sync ({prod['cad_document']})",
        status="pending"
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    planning_res = plan_production_order(db, new_order)
    
    return {
        "plm_request": req,
        "erp_order_id": order_id,
        "planning_result": planning_res
    }

@router.post("/sync/{order_id}")
def sync_plm_order(order_id: str, db: Session = Depends(get_db)):
    """Manually trigger PLM status synchronization for an order."""
    order = db.query(ProductionOrderDB).filter(ProductionOrderDB.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail=f"Order {order_id} not found.")

    res = plm_service_instance.sync_order_status(order.order_id, order.status.upper())
    return res
