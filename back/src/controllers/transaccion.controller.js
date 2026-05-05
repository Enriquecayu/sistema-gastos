import Transaccion from "../models/Transaccion.js";
import { literal, Op } from "sequelize";

// 1. OBTENER ACTIVAS: Filtrado por usuario logueado
export const getTransacciones = async (req, res) => {
    try {
        const lista = await Transaccion.findAll({
            where: { userId: req.usuarioId }, // <--- Solo las mías
            order: [['createdAt', 'DESC']]
        });
        res.json(lista);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las transacciones activas" });
    }
};

// 2. OBTENER BORRADAS: Solo la papelera del usuario actual
export const getBorradas = async (req, res) => {
    try {
        const listaBorradas = await Transaccion.findAll({
            where: {
                userId: req.usuarioId, // <--- Solo mis borradas
                deletedAt: { [Op.ne]: null }
            },
            paranoid: false,
            order: [['deletedAt', 'DESC']]
        });
        res.json(listaBorradas);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la papelera" });
    }
};

// 3. CREAR: Se le asigna el ID del usuario automáticamente
export const postTransacciones = async (req, res) => {
    try {
        const { monto, descripcion, tipo, categoria } = req.body;

        if (!monto || !descripcion || !tipo) {
            return res.status(400).json("TODOS LOS CAMPOS SON OBLIGATORIOS");
        }

        // Guardamos incluyendo el userId que viene del token
        const nuevoDatos = await Transaccion.create({ 
            monto, 
            descripcion, 
            tipo, 
            categoria,
            userId: req.usuarioId // <--- Vinculación automática
        });
        res.status(201).json(nuevoDatos);
    } catch (error) {
        res.status(500).json({ error: "Error al registrar nuevos datos" });
    }
};

// 4. BALANCE: Calcula el saldo exclusivo del usuario logueado
export const getBalance = async (req, res) => {
    try {
        const resultado = await Transaccion.findAll({
            where: { userId: req.usuarioId }, // <--- Balance personal
            attributes: [
                [
                    literal(`COALESCE(SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE -monto END), 0)`),
                    'saldo_total'
                ]
            ]
        });
        res.json(resultado[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al calcular el balance" });
    }
};

// 5. BORRADO LÓGICO: Solo permite borrar si la transacción te pertenece
export const delTransaccion = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await Transaccion.destroy({
            where: { 
                id: id,
                userId: req.usuarioId // <--- Seguridad extra: No puedo borrar lo ajeno
            }
        });

        if (eliminado === 0) {
            return res.status(404).json({ message: "No se encontró la transacción o no tienes permiso" });
        }

        res.json({ message: "Transacción enviada a la papelera" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar los datos" });
    }
};

// 6. RESTAURAR: Solo restaura si es tuya
export const restoreTransaccion = async (req, res) => {
    try {
        const { id } = req.params;
        await Transaccion.restore({
            where: { 
                id: id,
                userId: req.usuarioId // <--- Seguridad extra
            }
        });

        res.json({ message: "Transacción restaurada correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al restaurar la transacción" });
    }
};