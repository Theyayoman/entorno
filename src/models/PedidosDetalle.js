import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize";
import Pedido from "@/models/Pedidos";
import Producto from "@/models/Productos";

const PedidoDetalle = sequelize.define(
  "PedidoDetalle",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cmd_id: { type: DataTypes.INTEGER, allowNull: false },
    producto_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "cmddetalle",
    timestamps: false, // Si tu tabla no usa `createdAt` y `updatedAt`
  }
);

PedidoDetalle.belongsTo(Pedido, { foreignKey: "cmd_id" });
PedidoDetalle.belongsTo(Producto, { foreignKey: "producto_id" });

export default PedidoDetalle;