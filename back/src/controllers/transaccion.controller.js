import Transaccion from "../models/Transaccion.js";
import { literal } from "sequelize";
export const getTransacciones = async (req, res) => {
    try {
        const lista = await Transaccion.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(lista)
    } catch (error) {
        res.status(500).json({ error: "Error a obtener los datos" });
    }
}

export const postTransacciones = async (req, res) => {
    try {
        const { monto, descripcion, tipo } = req.body;

        if (!monto || !descripcion || !tipo) {
            return res.status(400).json("TODOS LOS CAMPOS SON OBLIGATORIOS");
        }

        const nuevoDatos = await Transaccion.create({ monto, descripcion, tipo });
        res.status(201).json(nuevoDatos);
    } catch (error) {
        res.status(500).json({ error: "Error al registrar nuevos datos" });
    }
}

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

        // Retornamos solo el número para que React lo use fácil
        res.json(resultado[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al calcular el balance" });
    }
};

export const delTransaccion = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await Transaccion.destroy({
            where: { id: id }
        });

        if (eliminado == 0) {
            return res.status(404).json({ message: "no se encontro la transaccion" });
        }

        res.json({ message: "Transaccion eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar los datos" });
    }
}