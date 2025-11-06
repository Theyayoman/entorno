import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize";

const Identificador = sequelize.define(
  "Identificador",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: true },
    medicion: { type: DataTypes.STRING, allowNull: true },
    calculable: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
  },
  {
    tableName: "identificadores",
    timestamps: false, // Si tu tabla no usa `createdAt` y `updatedAt`
  }
);

export default Identificador;