import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize";
import Identificador from "@/models/Identificadores";
import Producto from "@/models/Productos";

const IdentificadorProducto = sequelize.define(
  "IdentificadorProducto",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    identificador_id: { type: DataTypes.INTEGER, allowNull: true },
    producto_id: { type: DataTypes.INTEGER, allowNull: true },
    tolerado: { type: DataTypes.INTEGER, allowNull: true },
    registroV: { type: DataTypes.STRING, allowNull: true },
    registroN: { type: DataTypes.DOUBLE, allowNull: true },
  },
  {
    tableName: "identificadores_productos",
    timestamps: false, // Si tu tabla no usa `createdAt` y `updatedAt`
  }
);

IdentificadorProducto.belongsTo(Identificador, { foreignKey: "identificador_id" });
IdentificadorProducto.belongsTo(Producto, { foreignKey: "producto_id" });

export default IdentificadorProducto;