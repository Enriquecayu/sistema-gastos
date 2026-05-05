import { getTransacciones, getBalance, postTransacciones, delTransaccion, getBorradas, restoreTransaccion } from "../controllers/transaccion.controller.js";
import { Router } from "express";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verificarToken);

//OBTENER TODAS LAS TRANSACCIONES
router.get("/transacciones", getTransacciones);
//OBTENER LAS TRANSACCIONES ELIMINADAS
router.get("/transacciones/papelera", getBorradas);
//OBTENER EL BALANCE DE GASTOS E INGRESOS
router.get("/balance", getBalance);
//ENVIAR UNA NUEVA TRANSACCION
router.post("/transacciones", postTransacciones);
//ELIMINAR UNA TRANSACCION
router.delete("/transacciones/:id", delTransaccion);
//RESTAURA LAS TRANSACCIONES ELIMINADAS
router.post("/transacciones/restaurar/:id", restoreTransaccion);

export default router;