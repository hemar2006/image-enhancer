import io
import base64
from typing import Tuple, Dict, Any
from PIL import Image, ImageOps
import cv2
import numpy as np

MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

def validate_image_file(file_bytes: bytes, filename: str, content_type: str) -> None:
    """Validates image file size, type, and corruption."""
    if len(file_bytes) == 0:
        raise ValueError("Uploaded file is empty.")
    
    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        max_mb = MAX_FILE_SIZE_BYTES / (1024 * 1024)
        raise ValueError(f"File size exceeds maximum allowed limit of {max_mb:.0f}MB.")
    
    ext = f".{filename.split('.')[-1].lower()}" if "." in filename else ""
    if ext not in ALLOWED_EXTENSIONS and content_type.lower() not in ALLOWED_MIME_TYPES:
        raise ValueError(f"Unsupported file format '{ext or content_type}'. Supported formats: JPG, PNG, WebP.")
    
    # Check if PIL can decode the image without raising exception
    try:
        with Image.open(io.BytesIO(file_bytes)) as img:
            img.verify()
    except Exception:
        raise ValueError("Corrupted or invalid image file. Please upload a valid image.")

def bytes_to_numpy(file_bytes: bytes) -> np.ndarray:
    """Converts raw image bytes to an RGB numpy array (H, W, 3)."""
    with Image.open(io.BytesIO(file_bytes)) as img:
        img = ImageOps.exif_transpose(img)  # Handle EXIF rotation tags
        img = img.convert("RGB")
        return np.array(img)

def numpy_to_base64_png(img_np: np.ndarray) -> str:
    """Converts an RGB numpy array to a Base64-encoded PNG string."""
    pil_img = Image.fromarray(img_np.astype(np.uint8))
    buffer = io.BytesIO()
    pil_img.save(buffer, format="PNG", compress_level=6)
    encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{encoded}"

def numpy_to_bytes(img_np: np.ndarray, format_str: str = "PNG") -> bytes:
    """Converts an RGB numpy array to PNG or JPEG bytes."""
    pil_img = Image.fromarray(img_np.astype(np.uint8))
    buffer = io.BytesIO()
    pil_img.save(buffer, format=format_str.upper())
    return buffer.getvalue()
