from typing import Dict, Any, List, Optional
from datetime import datetime
from app.services.plm_service import AbstractPLMService, get_plm_environment_config

class MockPLMService(AbstractPLMService):
    """
    Mock Implementation of PTC Windchill PLM REST Integration.
    Clearly designated as DEMO / MOCK for evaluation.
    """

    def __init__(self):
        self.env_config = get_plm_environment_config()
        self._products = {
            "PLM-GEAR-001": {
                "product_id": "PLM-GEAR-001",
                "name": "Gear",
                "revision": "A",
                "material": "Steel",
                "lifecycle_state": "RELEASED",
                "cad_document": "GEAR_REV_A.step",
                "cad_file_size": "4.2 MB",
                "designer": "M. Mechanical",
                "created_date": "2026-01-15",
                "bom": [
                    {"item_id": "PART-001", "name": "Gear Body", "qty_per_assembly": 1, "material": "Steel 4140"},
                    {"item_id": "PART-002", "name": "Shaft", "qty_per_assembly": 1, "material": "Steel 1045"},
                    {"item_id": "PART-003", "name": "Key", "qty_per_assembly": 1, "material": "High Carbon Steel"},
                    {"item_id": "PART-004", "name": "Bearing", "qty_per_assembly": 2, "material": "Chrome Steel"}
                ],
                "documents": [
                    {"doc_id": "CAD-GEAR-01", "title": "GEAR_REV_A.step", "type": "STEP 3D Model", "version": "A.1"},
                    {"doc_id": "DWG-GEAR-01", "title": "GEAR_DRAWING_REV_A.pdf", "type": "2D Engineering Drawing", "version": "A.1"}
                ]
            },
            "PLM-VALVE-001": {
                "product_id": "PLM-VALVE-001",
                "name": "Valve Body",
                "revision": "B",
                "material": "Stainless Steel",
                "lifecycle_state": "RELEASED",
                "cad_document": "VALVE_REV_B.step",
                "cad_file_size": "8.7 MB",
                "designer": "S. Fluidic",
                "created_date": "2026-02-01",
                "bom": [
                    {"item_id": "PART-101", "name": "Valve Body", "qty_per_assembly": 1, "material": "Stainless Steel 316L"},
                    {"item_id": "PART-102", "name": "Stem", "qty_per_assembly": 1, "material": "Stainless Steel 304"},
                    {"item_id": "PART-103", "name": "Seat", "qty_per_assembly": 1, "material": "PTFE Polymer"},
                    {"item_id": "PART-104", "name": "Gasket", "qty_per_assembly": 2, "material": "Viton Rubber"}
                ],
                "documents": [
                    {"doc_id": "CAD-VALVE-01", "title": "VALVE_REV_B.step", "type": "STEP 3D Model", "version": "B.2"},
                    {"doc_id": "DWG-VALVE-01", "title": "VALVE_SPEC_REV_B.pdf", "type": "2D Tech Spec", "version": "B.2"}
                ]
            },
            "PLM-SHAFT-001": {
                "product_id": "PLM-SHAFT-001",
                "name": "Shaft",
                "revision": "A",
                "material": "Aluminium",
                "lifecycle_state": "RELEASED",
                "cad_document": "SHAFT_REV_A.step",
                "cad_file_size": "2.1 MB",
                "designer": "R. Drive",
                "created_date": "2026-02-10",
                "bom": [
                    {"item_id": "PART-201", "name": "Shaft Stock", "qty_per_assembly": 1, "material": "Aluminium 6061-T6"},
                    {"item_id": "PART-202", "name": "Keyway Pin", "qty_per_assembly": 2, "material": "Stainless Steel"}
                ],
                "documents": [
                    {"doc_id": "CAD-SHAFT-01", "title": "SHAFT_REV_A.step", "type": "STEP 3D Model", "version": "A.1"}
                ]
            }
        }
        self._synced_orders = {}

    def get_status(self) -> Dict[str, Any]:
        return {
            "status": "ONLINE",
            "mode": "DEMO / MOCK",
            "provider": "PTC Windchill Integration Gateway (Mock)",
            "system_banner": "PLM Integration: DEMO / MOCK",
            "active_products": len(self._products),
            "environment_vars": {
                "WINDCHILL_BASE_URL": self.env_config["WINDCHILL_BASE_URL"],
                "WINDCHILL_CLIENT_ID": self.env_config["WINDCHILL_CLIENT_ID"] or "(configured via env)",
                "WINDCHILL_CLIENT_SECRET": "***" if self.env_config["WINDCHILL_CLIENT_SECRET"] else "(configured via env)"
            },
            "last_heartbeat": datetime.utcnow().isoformat()
        }

    def get_products(self) -> List[Dict[str, Any]]:
        return list(self._products.values())

    def get_product_details(self, product_id: str) -> Optional[Dict[str, Any]]:
        return self._products.get(product_id)

    def get_product_bom(self, product_id: str) -> List[Dict[str, Any]]:
        prod = self._products.get(product_id)
        return prod["bom"] if prod else []

    def get_product_documents(self, product_id: str) -> List[Dict[str, Any]]:
        prod = self._products.get(product_id)
        return prod["documents"] if prod else []

    def create_production_request(self, product_id: str, quantity: int, due_date: str) -> Dict[str, Any]:
        prod = self._products.get(product_id)
        if not prod:
            raise ValueError(f"Product {product_id} not found in PLM catalog.")
        
        req_id = f"PLM-REQ-{int(datetime.utcnow().timestamp())}"
        return {
            "plm_request_id": req_id,
            "product_id": product_id,
            "product_name": prod["name"],
            "revision": prod["revision"],
            "material": prod["material"],
            "quantity": quantity,
            "due_date": due_date,
            "status": "APPROVED_FOR_ERP",
            "timestamp": datetime.utcnow().isoformat()
        }

    def sync_order_status(self, order_id: str, status: str, schedule_info: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        self._synced_orders[order_id] = {
            "order_id": order_id,
            "status": status,
            "schedule": schedule_info,
            "synced_at": datetime.utcnow().isoformat()
        }
        return {
            "success": True,
            "message": f"Order {order_id} status updated in PLM to {status}",
            "order_id": order_id,
            "plm_sync_status": "SYNCHRONIZED"
        }

# Global Instance
plm_service_instance = MockPLMService()
