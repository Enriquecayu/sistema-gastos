import Transaccion from "../models/Transaccion.js";
import { literal, Op } from "sequelize";

// 1. OBTENER ACTIVAS: Sequelize filtra automáticamente las que tienen deletedAt
export const getTransacciones = async (req, res) => {
    try {
        const lista = await Transaccion.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(lista);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las transacciones activas" });
    }
};

// 2. OBTENER BORRADAS: Usamos paranoid: false y filtramos por deletedAt
export const getBorradas = async (req, res) => {
    try {
        const listaBorradas = await Transaccion.findAll({
            where: {
                deletedAt: { [Op.ne]: null } // Que NO sea nulo
            },
            paranoid: false, // Obligatorio para poder ver registros con deletedAt
            order: [['deletedAt', 'DESC']]
        });
        res.json(listaBorradas);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la papelera" });
    }
};

// 3. CREAR: Se mantiene igual
export const postTransacciones = async (req, res) => {
    try {
        const { monto, descripcion, tipo, categoria } = req.body;

        if (!monto || !descripcion || !tipo) {
            return res.status(400).json("TODOS LOS CAMPOS SON OBLIGATORIOS");
        }

        const nuevoDatos = await Transaccion.create({ monto, descripcion, tipo, categoria });
        res.status(201).json(nuevoDatos);
    } catch (error) {
        res.status(500).json({ error: "Error al registrar nuevos datos" });
    }
};

// 4. BALANCE: Calcula el saldo ignorando automáticamente las borradas
export const getBalance = async (req, res) => {
    try {
        const resultado = await Transaccion.findAll({
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

// 5. BORRADO LÓGICO: Llena la columna deletedAt
export const delTransaccion = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await Transaccion.destroy({
            where: { id: id }
        });

        if (eliminado === 0) {
            return res.status(404).json({ message: "No se encontró la transacción" });
        }

        res.json({ message: "Transacción enviada a la papelera" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar los datos" });
    }
};

// 6. RESTAURAR: Limpia la columna deletedAt para que vuelva a ser activa
export const restoreTransaccion = async (req, res) => {
    try {
        const { id } = req.params;
        await Transaccion.restore({
            where: { id: id }
        });

        res.json({ message: "Transacción restaurada correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al restaurar la transacción" });
    }
};