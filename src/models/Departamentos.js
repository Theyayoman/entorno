import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize"; // Asegúrate de tener tu conexión en este archivo

const Departamento = sequelize.define(
  "Departamento",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "departamentos",
    timestamps: false, // Si tu tabla no usa `createdAt` y `updatedAt`
  }
);

export default Departamento;