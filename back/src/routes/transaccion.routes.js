import { getTransacciones, getBalance, postTransacciones } from "../controllers/transaccion.controller.js";
import { Router } from "express";

const router = Router();
//OBTENER TODAS LAS TRANSACCIONES
router.get("/transacciones", getTransacciones);
//OBTENER EL BALANCE DE GASTOS E INGRESOS
router.get("/balance", getBalance);
//ENVIAR UNA NUEVA TRANSACCION
router.post("/transacciones", postTransacciones);

export default router;