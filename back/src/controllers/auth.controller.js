import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// REGISTRO DE USUARIOS
export const register = async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        // 1. Validar si el usuario ya existe
        const existe = await User.findOne({ where: { email } });
        if (existe) {
            return res.status(400).json({ mensaje: "Este correo ya está registrado" });
        }

        // 2. Encriptar contraseña (Hash)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Crear el usuario en la DB
        const nuevoUsuario = await User.create({
            nombre,
            email,
            password: hashedPassword
        });

        res.status(201).json({ 
            mensaje: "Usuario institucional creado con éxito",
            usuario: { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre } 
        });

    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ mensaje: "Error al registrar el usuario" });
    }
};

// LOGIN DE USUARIOS
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Buscar usuario por email
        const usuario = await User.findOne({ where: { email } });
        if (!usuario) {
            return res.status(404).json({ mensaje: "El usuario no existe" });
        }

        // 2. Verificar la contraseña
        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) {
            return res.status(401).json({ mensaje: "Contraseña incorrecta" });
        }

        // 3. Crear el Token (JWT)
        // Guardamos el id y el nombre dentro del token
        const token = jwt.sign(
            { id: usuario.id, nombre: usuario.nombre },
            'clave_secreta_aguaray_2026', // Idealmente usar una variable de entorno .env
            { expiresIn: '24h' }
        );

        res.json({
            mensaje: "Ingreso exitoso",
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email
            }
        });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ mensaje: "Error al iniciar sesión" });
    }
};