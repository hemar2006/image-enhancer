import os
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional

class AbstractPLMService(ABC):
    """
    Abstract PLM Integration Service Interface.
    Decouples ERP production planning from specific PLM providers (e.g. PTC Windchill).
    """

    @abstractmethod
    def get_status(self) -> Dict[str, Any]:
        """Returns current PLM connection status and metadata."""
        pass

    @abstractmethod
    def get_products(self) -> List[Dict[str, Any]]:
        """Fetch all managed PLM products and revisions."""
        pass

    @abstractmethod
    def get_product_details(self, product_id: str) -> Optional[Dict[str, Any]]:
        """Fetch details for a specific PLM product."""
        pass

    @abstractmethod
    def get_product_bom(self, product_id: str) -> List[Dict[str, Any]]:
        """Fetch Bill of Materials for a PLM product."""
        pass

    @abstractmethod
    def get_product_documents(self, product_id: str) -> List[Dict[str, Any]]:
        """Fetch associated CAD documents (.step, drawings) for a PLM product."""
        pass

    @abstractmethod
    def create_production_request(self, product_id: str, quantity: int, due_date: str) -> Dict[str, Any]:
        """Trigger a production order request in PLM."""
        pass

    @abstractmethod
    def sync_order_status(self, order_id: str, status: str, schedule_info: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Sync production schedule/status back to PLM."""
        pass


def get_plm_environment_config() -> Dict[str, str]:
    """
    Helper to read environment variables configured for real PTC Windchill REST API integration.
    """
    return {
        "WINDCHILL_BASE_URL": os.getenv("WINDCHILL_BASE_URL", "https://windchill.company.internal/Windchill/api/v1"),
        "WINDCHILL_CLIENT_ID": os.getenv("WINDCHILL_CLIENT_ID", ""),
        "WINDCHILL_CLIENT_SECRET": os.getenv("WINDCHILL_CLIENT_SECRET", ""),
        "IS_MOCK": os.getenv("WINDCHILL_BASE_URL") is None
    }
