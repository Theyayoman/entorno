import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize";
import TipoMateriaPrima from "@/models/TiposMateriasPrimas";

const CategoriaMateriaPrima = sequelize.define(
  "CategoriaMateriaPrima",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: true },
    Tipo_id: { type: DataTypes.INTEGER, allowNull: true },
    seguimiento: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    tableName: "categoriamaterialesprima",
    timestamps: false, // Si tu tabla no usa `createdAt` y `updatedAt`
  }
);

CategoriaMateriaPrima.belongsTo(TipoMateriaPrima, { foreignKey: "Tipo_id" });
CategoriaMateriaPrima.belongsTo(TipoMateriaPrima, { foreignKey: "seguimiento" });

export default CategoriaMateriaPrima;