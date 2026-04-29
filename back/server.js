import express from 'express';
import sequelize from "./src/db.js";
import transaccion from "./src/models/Transaccion.js"
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

async function main() {
    try {
        await sequelize.authenticate();

        await sequelize.sync({ alter: true });
        
        console.log("TABLAS SINCRONIZADAS CON POSTGRESQL");

        app.listen(PORT, () => {
            console.log(`SERVIDOR CORRIENDO EN http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("ERROR AL INICIAR EL SERVIDOR");
    }
}

main();