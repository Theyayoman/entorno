import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize";

const NombreProducto = sequelize.define(
  "NombreProducto",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    levantamiento_id: { type: DataTypes.INTEGER, allowNull: false },
    nombre: { type: DataTypes.STRING, allowNull: true },
    estatus_nombre: { type: DataTypes.INTEGER, allowNull: true },
    comentarios_nombre: { type: DataTypes.STRING, allowNull: true },
    logo: { type: DataTypes.STRING, allowNull: true },
    estatus_logo: { type: DataTypes.INTEGER, allowNull: true },
    comentarios_logo: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "nombre_producto",
    timestamps: false, // Si tu tabla no usa `createdAt` y `updatedAt`
  }
);

export default NombreProducto;