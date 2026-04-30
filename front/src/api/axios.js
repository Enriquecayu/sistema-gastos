import axios from 'axios';

const api = axios.create({
    // Aquí usamos el puerto del servidor Express
    baseURL: 'http://localhost:3000/api' 
});

export default api;