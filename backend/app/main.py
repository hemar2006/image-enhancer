from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.enhance import router as enhance_router

app = FastAPI(
    title="ImageEnhancer API",
    description="AI-powered Image Upscaling, Sharpening, and Denoising API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for local React frontend and production Render frontend
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://image-enhancer-1-5xev.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(enhance_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
