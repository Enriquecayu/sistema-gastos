import axios from 'axios';

const api = axios.create({
    // Aquí usamos el puerto del servidor Express
    baseURL: import.meta.env.VITE_API_URL
});

export default api;