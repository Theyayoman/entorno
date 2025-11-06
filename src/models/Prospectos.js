import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize";

const Prospecto = sequelize.define(
  "Prospecto",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    telefono: { type: DataTypes.INTEGER, allowNull: true },
    correo: { type: DataTypes.STRING, allowNull: false },
    marca: { type: DataTypes.STRING, allowNull: false },
    redes_sociales: { type: DataTypes.STRING, allowNull: true },
    constancia: { type: DataTypes.STRING, allowNull: true },
    odoo_id: { type: DataTypes.INTEGER, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: true },
    updatedAt: { type: DataTypes.DATE, allowNull: true },
    deletedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: "prospectos",
    timestamps: true,
    paranoid: true,
  }
);

export default Prospecto;