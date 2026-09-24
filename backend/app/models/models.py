from datetime import datetime
from typing import Optional, List
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from pydantic import BaseModel, ConfigDict
from app.database import Base

# --- SQLAlchemy Models ---

class ProductionOrderDB(Base):
    __tablename__ = "production_orders"

    order_id = Column(String, primary_key=True, index=True)
    product = Column(String, nullable=False, index=True)
    quantity = Column(Integer, nullable=False)
    due_date = Column(String, nullable=False)
    source_file = Column(String, nullable=True)
    status = Column(String, nullable=False, default="pending")  # pending, ready_for_scheduling, material_shortage, scheduled, completed
    shortage_qty = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    schedules = relationship("ScheduleDB", back_populates="order", cascade="all, delete-orphan")


class InventoryDB(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, autoincrement=True)
    product = Column(String, unique=True, nullable=False, index=True)
    stock_qty = Column(Integer, nullable=False, default=0)
    reorder_level = Column(Integer, nullable=False, default=50)
    allocated_qty = Column(Integer, nullable=False, default=0)


class MachineDB(Base):
    __tablename__ = "machines"

    machine_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    status = Column(String, nullable=False, default="idle")  # idle, running, maintenance
    shift_capacity = Column(Integer, nullable=False, default=8)

    schedules = relationship("ScheduleDB", back_populates="machine")


class ScheduleDB(Base):
    __tablename__ = "schedules"

    schedule_id = Column(String, primary_key=True, index=True)
    order_id = Column(String, ForeignKey("production_orders.order_id"), nullable=False)
    machine_id = Column(String, ForeignKey("machines.machine_id"), nullable=False)
    shift = Column(String, nullable=False)  # Shift 1 (08:00-16:00), Shift 2 (16:00-00:00), Shift 3 (00:00-08:00)
    start_time = Column(String, nullable=False)
    status = Column(String, nullable=False, default="scheduled")

    order = relationship("ProductionOrderDB", back_populates="schedules")
    machine = relationship("MachineDB", back_populates="schedules")


# --- Pydantic Schemas (v2) ---

class OrderCreate(BaseModel):
    order_id: Optional[str] = None
    product: str
    quantity: int
    due_date: str
    source_file: Optional[str] = "Manual Entry"

class OrderResponse(BaseModel):
    order_id: str
    product: str
    quantity: int
    due_date: str
    source_file: Optional[str] = None
    status: str
    shortage_qty: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class InventoryCreate(BaseModel):
    product: str
    stock_qty: int
    reorder_level: Optional[int] = 50

class InventoryUpdate(BaseModel):
    stock_qty: int

class InventoryResponse(BaseModel):
    id: int
    product: str
    stock_qty: int
    reorder_level: int
    allocated_qty: int
    available_qty: int

    model_config = ConfigDict(from_attributes=True)

class MachineResponse(BaseModel):
    machine_id: str
    name: str
    type: str
    status: str
    shift_capacity: int
    current_load: Optional[int] = 0

    model_config = ConfigDict(from_attributes=True)

class MachineStatusUpdate(BaseModel):
    status: str

class ScheduleResponse(BaseModel):
    schedule_id: str
    order_id: str
    machine_id: str
    machine_name: Optional[str] = None
    product: Optional[str] = None
    quantity: Optional[int] = None
    shift: str
    start_time: str
    status: str

    model_config = ConfigDict(from_attributes=True)

class DocumentExtractionResult(BaseModel):
    order_id: Optional[str] = None
    product: Optional[str] = None
    quantity: Optional[int] = None
    due_date: Optional[str] = None
    material: Optional[str] = None
    missing_fields: List[str] = []
    raw_text: Optional[str] = None
    confidence: float = 0.95
