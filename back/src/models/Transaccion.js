import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const transaccion = sequelize.define("transaccion", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    monto: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: {
            isDecimal: true,
            min: 0.01
        }
    },
    descripcion: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    tipo: {
        type: DataTypes.ENUM("ingreso", "gasto"),
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: "transaccion"
});

export default transaccion;