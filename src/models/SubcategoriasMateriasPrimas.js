import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize";
import TipoMateriaPrima from "@/models/TiposMateriasPrimas";
import CategoriaMateriaPrima from "@/models/CategoriasMateriasPrimas"

const SubcategoriaMateriaPrima = sequelize.define(
  "SubcategoriaMateriaPrima",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: true },
    Tipo_id: { type: DataTypes.INTEGER, allowNull: true },
    Categoria_id: { type: DataTypes.INTEGER, allowNull: true },
    seguimiento_sub: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    tableName: "subcategoriamaterialesprima",
    timestamps: false, // Si tu tabla no usa `createdAt` y `updatedAt`
  }
);

SubcategoriaMateriaPrima.belongsTo(TipoMateriaPrima, { foreignKey: "Tipo_id" });
SubcategoriaMateriaPrima.belongsTo(CategoriaMateriaPrima, { foreignKey: "Categoria_id" });
SubcategoriaMateriaPrima.belongsTo(TipoMateriaPrima, { foreignKey: "seguimiento_sub" });

export default SubcategoriaMateriaPrima;