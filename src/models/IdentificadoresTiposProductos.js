import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize";
import Identificador from "@/models/Identificadores";
import TipoMateriaPrima from "@/models/TiposMateriasPrimas";

const IdentificadorTipoProducto = sequelize.define(
  "IdentificadorTipoProducto",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    identificador_id: { type: DataTypes.INTEGER, allowNull: false },
    tipo_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "identificadores_tipos_productos",
    timestamps: false, // Si tu tabla no usa `createdAt` y `updatedAt`
  }
);

IdentificadorTipoProducto.belongsTo(Identificador, { foreignKey: "identificador_id" });
IdentificadorTipoProducto.belongsTo(TipoMateriaPrima, { foreignKey: "tipo_id" });

export default IdentificadorTipoProducto;