import axios from 'axios';
import "dotenv/config";

const api = axios.create({
    // Aquí usamos el puerto del servidor Express
    baseURL: import.meta.env.VITE_API_URL
});

export default api;