from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from fastapi.responses import JSONResponse
import logging

from app.models.schemas import HealthResponse, ImageEnhanceResponse, ErrorResponse
from app.services.enhancer import ImageEnhancementService

logger = logging.getLogger("image_enhancer")
router = APIRouter()

enhancer_service = ImageEnhancementService()

@router.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint to verify backend operational status."""
    return HealthResponse(
        status="ok",
        message="ImageEnhancer API service is healthy and operational.",
        version="1.0.0"
    )

@router.post(
    "/enhance",
    response_model=ImageEnhanceResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Validation Error"},
        500: {"model": ErrorResponse, "description": "Processing Error"}
    },
    tags=["Enhancement"]
)
async def enhance_image(
    file: UploadFile = File(...),
    upscale_factor: int = Form(2),
    sharpen: bool = Form(False),
    denoise: bool = Form(False)
):
    """Enhances an uploaded image with AI upscaling (2x/4x), noise reduction, and sharpening."""
    if upscale_factor not in (2, 4):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Upscale factor must be either 2 or 4."
        )

    try:
        file_bytes = await file.read()
        filename = file.filename or "uploaded_image.png"
        content_type = file.content_type or "image/png"

        result = enhancer_service.process_image(
            file_bytes=file_bytes,
            filename=filename,
            content_type=content_type,
            upscale_factor=upscale_factor,
            apply_sharpen=sharpen,
            apply_denoise=denoise
        )
        return JSONResponse(status_code=status.HTTP_200_OK, content=result)

    except ValueError as val_err:
        logger.warning(f"Validation error processing image: {str(val_err)}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "error": str(val_err)}
        )
    except Exception as exc:
        logger.error(f"Internal processing error: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "error": "Failed to process image. An internal error occurred. Please try again with a different image."
            }
        )
