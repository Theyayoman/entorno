import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize";
import Producto from "@/models/Productos";

const ImagenProducto = sequelize.define(
  "ImagenProducto",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ruta: { type: DataTypes.STRING, allowNull: true },
    producto_id: { type: DataTypes.INTEGER, allowNull: true },
    tipo: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    tableName: "imgproductos",
    timestamps: false, // Si tu tabla no usa `createdAt` y `updatedAt`
  }
);

export default ImagenProducto;