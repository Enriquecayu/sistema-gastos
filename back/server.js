import "dotenv/config";
import express from 'express';
import cors from "cors";
import sequelize from "./src/db.js";
import transaccionRoutes from "./src/routes/transaccion.routes.js"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.FRONTEND_URL, // Solo permite peticiones desde tu React
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use("/api", transaccionRoutes);

async function main() {
    try {
        await sequelize.authenticate();

        await sequelize.sync({ alter: true });

        console.log("TABLAS SINCRONIZADAS CON POSTGRESQL");

        app.listen(PORT, () => {
            console.log(`SERVIDOR CORRIENDO EN http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("❌ ERROR DETALLADO:", error.message);
    }
}

main();