import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
    // 1. Obtener el token del header (se suele enviar como 'Authorization: Bearer TOKEN')
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Cortamos el "Bearer"

    if (!token) {
        return res.status(403).json({ mensaje: "Token no proporcionado, acceso denegado" });
    }

    try {
        // 2. Verificar el token con la misma clave secreta del login
        const decoded = jwt.verify(token, 'clave_secreta_aguaray_2026');

        // 3. Inyectar los datos del usuario en la petición
        req.usuarioId = decoded.id;
        req.usuarioNombre = decoded.nombre;

        // 4. Continuar al siguiente paso (el controlador)
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: "Token inválido o expirado" });
    }
};