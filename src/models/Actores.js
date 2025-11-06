import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize";
import Usuario from "@/models/Usuarios";

const Actor = sequelize.define(
  "Actor",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    tipo: { type: DataTypes.INTEGER, allowNull: false },
    eliminado: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
  },
  {
    tableName: "actorescatalogo",
    timestamps: false, // Si tu tabla no usa `createdAt` y `updatedAt`
  }
);

Actor.belongsTo(Usuario, { foreignKey: "user_id" });

export default Actor;