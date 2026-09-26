import axios from 'axios';

// FastAPI Backend Base URL (uses Vite env var or defaults to local proxy)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 4000 });
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    return null;
  }
};

export const enhanceImage = async ({ file, upscaleFactor, sharpen, denoise }) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upscale_factor', upscaleFactor);
  formData.append('sharpen', sharpen ? 'true' : 'false');
  formData.append('denoise', denoise ? 'true' : 'false');

  try {
    const response = await axios.post(`${API_BASE_URL}/enhance`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000, // 2 min timeout for processing high-res images
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || error.response.data.detail || 'Image processing failed');
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('Processing timed out. Please try a smaller image.');
    }
    throw new Error('Unable to connect to image enhancement server. Please check your backend connection.');
  }
};
