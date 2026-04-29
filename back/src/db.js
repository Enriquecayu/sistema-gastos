import { Sequelize } from "sequelize";
import "dotenv/config";

const sequelize = new Sequelize({
    dialect: "postgres",
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    logging: false
});

try {
    await sequelize.authenticate();
    console.log("CONEXION ESTABLECIDA CON EXITO A LA BASE DE DATOS");
} catch (error) {
    console.error(error.message);
}

export default sequelize;