# ImageEnhancer 🚀

**ImageEnhancer** is a complete, modern, responsive web application for AI-powered image upscaling, sharpening, and noise reduction. It enables users to upload images (JPG, PNG, WebP), select 2× or 4× AI upscaling multipliers, apply smart noise reduction and edge sharpening, visually compare the original and enhanced results with an interactive slider, and download high-resolution outputs.

---

## 🌟 Key Features

- **AI-Powered Upscaling**: Choice of 2× or 4× resolution enhancement.
- **Adaptive Denoising**: Smooths out grainy noise while maintaining structural sharpness.
- **Smart Edge Sharpening**: Restores crisp high-frequency details with Unsharp Masking.
- **Interactive Before/After Slider**: Draggable comparison slider supporting desktop mouse and mobile touch events.
- **100% In-Memory & Private**: Images are processed temporarily in RAM and auto-deleted—no cloud tracking or persistent storage.
- **Format Support**: JPG, JPEG, PNG, and WebP (up to 15MB).
- **Responsive & Modern UI**: Built with Tailwind CSS, glassmorphism design, and mobile-first layout.
- **Modular Ad Placement**: Dedicated advertisement container compliant with third-party ad network standards.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React

### Backend
- **Framework**: Python 3.14 + FastAPI
- **Server**: Uvicorn
- **Image Processing Engine**: OpenCV (`opencv-python-headless`), Pillow (`PIL`), NumPy
- **Architecture**: Modular AI Super-Resolution Engine (`HybridAISuperResolutionEngine`)

---

## 📂 Project Structure

```text
ImageEnhancer/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── HeaderHero.jsx
│   │   │   ├── DropzoneUpload.jsx
│   │   │   ├── ControlPanel.jsx
│   │   │   ├── ProcessingIndicator.jsx
│   │   │   ├── BeforeAfterSlider.jsx
│   │   │   ├── Advertisement.jsx
│   │   │   └── Footer.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app setup & CORS config
│   │   ├── routes/
│   │   │   └── enhance.py       # API endpoints (/api/health, /api/enhance)
│   │   ├── services/
│   │   │   ├── enhancer.py      # Core Image Enhancement Pipeline
│   │   │   └── ai_model.py      # Modular AI Super-Resolution Engine
│   │   ├── models/
│   │   │   └── schemas.py       # Pydantic request/response schemas
│   │   └── utils/
│   │       └── image_processing.py # Image decoding, base64 & validation
│   └── requirements.txt
│
└── README.md
```

---

## 🚀 Installation & Local Setup

### 1. Install Backend Dependencies
Navigate to the `backend/` folder and install Python packages:

```bash
cd backend
python -m pip install -r requirements.txt
```

### 2. Install Frontend Dependencies
Navigate to the `frontend/` folder and install Node packages:

```bash
cd frontend
npm install
```

---

## 🏃 Running the Application

### Start the Backend API Server
In a terminal, start the FastAPI server with Uvicorn:

```bash
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

- **Backend API**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **API Documentation (Swagger UI)**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Health Check Endpoint**: [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)

### Start the Frontend Server
In a second terminal, start the Vite development server:

```bash
cd frontend
npm run dev
```

- **Frontend Application URL**: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testing the API

### Health Endpoint
```bash
curl http://127.0.0.1:8000/api/health
```
Response:
```json
{
  "status": "ok",
  "message": "ImageEnhancer API service is healthy and operational.",
  "version": "1.0.0"
}
```

### Image Enhancement Endpoint
```bash
curl -X POST "http://127.0.0.1:8000/api/enhance" \
  -F "file=@/path/to/test_image.jpg" \
  -F "upscale_factor=2" \
  -F "sharpen=true" \
  -F "denoise=true"
```

---

## 📱 How to Use the Application

1. Open [http://localhost:3000](http://localhost:3000) in your web browser.
2. Drag and drop an image (JPG, PNG, WebP) or click **Upload Image**.
3. Select your desired **AI Upscale Multiplier** (`2×` or `4×`).
4. Enable or disable **AI Denoise** and **Smart Sharpen**.
5. Click **Enhance Image**.
6. View the processing animation while the AI upscaler processes your image.
7. Use the interactive **Before/After Slider** to compare details side-by-side.
8. Click **Download Enhanced** to save your high-resolution result.
9. Click **Start Over** to process another image.

---

## 🔒 Security & Privacy Notice

- Images are processed in-memory (RAM) during API request handling.
- No uploaded files are written to permanent disk storage or database.
- No user accounts or personal tracking are required.
