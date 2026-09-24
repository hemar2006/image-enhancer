import time
from typing import Dict, Any
import cv2
import numpy as np

from app.utils.image_processing import (
    validate_image_file,
    bytes_to_numpy,
    numpy_to_base64_png,
    numpy_to_bytes
)
from app.services.ai_model import get_ai_upscaler, BaseAIUpscaler

class ImageEnhancementService:
    """Core image enhancement pipeline service handling validation, denoising,
    AI upscaling, sharpening, and result packaging.
    """
    def __init__(self, upscaler: BaseAIUpscaler = None):
        self.upscaler = upscaler or get_ai_upscaler()

    def denoise(self, img_rgb: np.ndarray) -> np.ndarray:
        """Applies Fast Non-Local Means Denoising to suppress noise while preserving edges."""
        # Convert RGB to BGR for OpenCV denoising
        img_bgr = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR)
        denoised_bgr = cv2.fastNlMeansDenoisingColored(
            img_bgr,
            None,
            h=7,
            hColor=7,
            templateWindowSize=7,
            searchWindowSize=21
        )
        return cv2.cvtColor(denoised_bgr, cv2.COLOR_BGR2RGB)

    def sharpen(self, img_rgb: np.ndarray) -> np.ndarray:
        """Applies Unsharp Masking filter for edge sharpening and detail emphasis."""
        gaussian = cv2.GaussianBlur(img_rgb, (0, 0), sigmaX=2.0)
        # Unsharp mask formula: sharp = img + amount * (img - gaussian)
        sharpened = cv2.addWeighted(img_rgb, 1.5, gaussian, -0.5, 0)
        return np.clip(sharpened, 0, 255).astype(np.uint8)

    def process_image(
        self,
        file_bytes: bytes,
        filename: str,
        content_type: str,
        upscale_factor: int,
        apply_sharpen: bool,
        apply_denoise: bool
    ) -> Dict[str, Any]:
        """Runs the complete image enhancement pipeline:
        Input bytes -> Validation -> Denoise (if enabled) -> AI Upscale -> Sharpen (if enabled) -> Result packaging
        """
        start_time = time.time()

        # Step 1: Validation
        validate_image_file(file_bytes, filename, content_type)

        # Step 2: Decode bytes to RGB numpy array
        img_rgb = bytes_to_numpy(file_bytes)
        orig_h, orig_w = img_rgb.shape[:2]
        orig_size_bytes = len(file_bytes)

        current_img = img_rgb

        # Step 3: Denoise (if enabled)
        if apply_denoise:
            current_img = self.denoise(current_img)

        # Step 4: AI Upscaling (2x or 4x)
        current_img = self.upscaler.upscale(current_img, factor=upscale_factor)
        enh_h, enh_w = current_img.shape[:2]

        # Step 5: Sharpening (if enabled)
        if apply_sharpen:
            current_img = self.sharpen(current_img)

        # Step 6: Encode result to base64 & calculate stats
        enhanced_base64 = numpy_to_base64_png(current_img)
        enhanced_raw_bytes = numpy_to_bytes(current_img, format_str="PNG")
        processing_time = round(time.time() - start_time, 3)

        return {
            "success": True,
            "original_filename": filename,
            "original_width": orig_w,
            "original_height": orig_h,
            "enhanced_width": enh_w,
            "enhanced_height": enh_h,
            "original_size_bytes": orig_size_bytes,
            "enhanced_size_bytes": len(enhanced_raw_bytes),
            "upscale_factor": upscale_factor,
            "sharpen_applied": apply_sharpen,
            "denoise_applied": apply_denoise,
            "processing_time_seconds": processing_time,
            "enhanced_image_base64": enhanced_base64
        }
