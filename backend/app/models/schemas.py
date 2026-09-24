from pydantic import BaseModel, Field
from typing import Optional

class HealthResponse(BaseModel):
    status: str = Field("ok", description="Service health status")
    message: str = Field(..., description="Status description message")
    version: str = Field("1.0.0", description="API version")

class ImageEnhanceResponse(BaseModel):
    success: bool = True
    message: str = "Image processed successfully"
    original_filename: str
    original_width: int
    original_height: int
    enhanced_width: int
    enhanced_height: int
    original_size_bytes: int
    enhanced_size_bytes: int
    upscale_factor: int
    sharpen_applied: bool
    denoise_applied: bool
    processing_time_seconds: float
    enhanced_image_base64: str

class ErrorResponse(BaseModel):
    success: bool = False
    error: str
    detail: Optional[str] = None
