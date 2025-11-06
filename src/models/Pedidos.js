import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize";
import Usuario from "@/models/Usuarios";

const Pedido = sequelize.define(
  "Pedido",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    created_for: { type: DataTypes.INTEGER, allowNull: false },
    prospecto_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    tableName: "cmd",
    timestamps: false, // Si tu tabla no usa `createdAt` y `updatedAt`
  }
);

Pedido.belongsTo(Usuario, { foreignKey: "created_for" });

export default Pedido;