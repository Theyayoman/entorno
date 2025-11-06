import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize";
import Producto from "@/models/Productos";

const Compatibilidad = sequelize.define(
    "Compatibilidad", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        codigo_producto: { type: DataTypes.STRING, allowNull: false },
        producto_tipo: { type: DataTypes.STRING, allowNull: true },
        codigo_compatible: { type: DataTypes.STRING, allowNull: false },
        compatibilidad_tipo: { type: DataTypes.STRING, allowNull: true },
    },
    {
        tableName: "compatibilidades",
        timestamps: false
    }
);

Compatibilidad.belongsTo(Producto, {
    foreignKey: "codigo_producto",
    targetKey: "codigo",
    as: "producto"
  });
  
  Compatibilidad.belongsTo(Producto, {
    foreignKey: "codigo_compatible",
    targetKey: "codigo",
    as: "compatible"
  });
  
export default Compatibilidad;