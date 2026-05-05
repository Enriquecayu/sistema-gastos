import "dotenv/config";
import express from 'express';
import cors from "cors";
import sequelize from "./src/db.js";

// Importación de Rutas
import transaccionRoutes from "./src/routes/transaccion.routes.js";
import authRoutes from "./src/routes/auth.routes.js"; // <-- Nueva ruta

// Importación de Modelos para establecer relaciones
import User from "./src/models/User.js";
import Transaccion from "./src/models/Transaccion.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// 1. DEFINICIÓN DE RELACIONES INSTITUCIONALES
// Un Usuario (Admin, Tesorero, etc.) puede tener muchos movimientos
User.hasMany(Transaccion, { foreignKey: 'userId', onDelete: 'CASCADE' });
// Cada movimiento pertenece a un único Usuario
Transaccion.belongsTo(User, { foreignKey: 'userId' });

// 2. REGISTRO DE RUTAS
app.use("/api/auth", authRoutes);       // Rutas de Login y Registro
app.use("/api", transaccionRoutes);    // Rutas de Movimientos

async function main() {
    try {
        // Verificar conexión
        await sequelize.authenticate();
        console.log("✅ CONEXIÓN A POSTGRESQL EXITOSA");

        // Sincronizar modelos (Crea la tabla Users y añade userId a Transaccions)
        await sequelize.sync({ alter: true });
        console.log("📊 TABLAS E INTEGRIDAD SINCRONIZADAS");

        app.listen(PORT, () => {
            console.log(`SERVIDOR CORRIENDO EN http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("ERROR DETALLADO:", error.message);
    }
}

main();