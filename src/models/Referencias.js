import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize";

const Referencia = sequelize.define(
  "Referencia",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    levantamiento_id: { type: DataTypes.INTEGER, allowNull: true },
    nombre: { type: DataTypes.STRING, allowNull: true },
    link: { type: DataTypes.STRING, allowNull: true },
    img1: { type: DataTypes.STRING, allowNull: true },
    img2: { type: DataTypes.STRING, allowNull: true },
    img3: { type: DataTypes.STRING, allowNull: true },
    img4: { type: DataTypes.STRING, allowNull: true },
    notas: { type: DataTypes.STRING, allowNull: true },
    tipo: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
  },
  {
    tableName: "referencias",
    timestamps: false, // Si tu tabla no usa `createdAt` y `updatedAt`
  }
);

export default Referencia;