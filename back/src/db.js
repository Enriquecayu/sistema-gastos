import { Sequelize } from "sequelize";
import "dotenv/config";

const sequelize = new Sequelize({
    dialect: "postgres",
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    logging: false,
    // 👇 AGREGÁ ESTA SECCIÓN JUSTO ACÁ 👇
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

try {
    await sequelize.authenticate();
    console.log("CONEXION ESTABLECIDA CON EXITO A LA BASE DE DATOS");
} catch (error) {
    // Te sumé el mensaje original detallado para que si pasa algo, Render te diga el porqué exacto
    console.error("ERROR DETALLADO:", error.message);
}

export default sequelize;