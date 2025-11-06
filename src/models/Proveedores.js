import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize";

const Proveedor = sequelize.define(
  "Proveedor",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: true },
    eliminado: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
  },
  {
    tableName: "proveedores",
    timestamps: false, // Si tu tabla no usa `createdAt` y `updatedAt`
  }
);

export default Proveedor;