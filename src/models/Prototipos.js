import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize";
import Producto from "./Productos";

const Prototipo = sequelize.define(
  "Prototipo",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    envase_id: { type: DataTypes.INTEGER, allowNull: true },
    tapa_id: { type: DataTypes.INTEGER, allowNull: true },
    sello_id: { type: DataTypes.INTEGER, allowNull: true },
    aditamento_id: { type: DataTypes.INTEGER, allowNull: true },
    formula_id: { type: DataTypes.INTEGER, allowNull: true },
    formato_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    tableName: "prototipos",
    timestamps: true, // Si tu tabla no usa `createdAt` y `updatedAt`
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

Prototipo.belongsTo(Producto, {
  foreignKey: "envase_id",
  targetKey: "id",
  as: "envase",
});
Prototipo.belongsTo(Producto, {
  foreignKey: "tapa_id",
  targetKey: "id",
  as: "tapa",
});
Prototipo.belongsTo(Producto, {
  foreignKey: "sello_id",
  targetKey: "id",
  as: "sello",
});
Prototipo.belongsTo(Producto, {
  foreignKey: "aditamento_id",
  targetKey: "id",
  as: "aditamento",
});
Prototipo.belongsTo(Producto, {
  foreignKey: "formula_id",
  targetKey: "id",
  as: "formula",
});
Prototipo.belongsTo(Producto, {
  foreignKey: "formato_id",
  targetKey: "id",
  as: "formato",
});

export default Prototipo;
