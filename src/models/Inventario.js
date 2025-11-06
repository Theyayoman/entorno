import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize";
import Usuario from "@/models/Usuarios";

const InventarioIT = sequelize.define(
  "InventarioIT",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tipo: { type: DataTypes.STRING, allowNull: true },
    marca: { type: DataTypes.STRING, allowNull: true },
    modelo: { type: DataTypes.STRING, allowNull: true },
    serie: { type: DataTypes.STRING, allowNull: true },
    etiqueta: { type: DataTypes.STRING, allowNull: true },
    fecha: { type: DataTypes.DATE, allowNull: true },
    observacion: { type: DataTypes.STRING, allowNull: true },
    usuario: { type: DataTypes.INTEGER, allowNull: true },
    ubicacion: { type: DataTypes.STRING, allowNull: true },
    localidad: { type: DataTypes.STRING, allowNull: true },
    estado: { type: DataTypes.STRING, allowNull: true },
    estatus: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "inventario",
    timestamps: false, // Si tu tabla no usa `createdAt` y `updatedAt`
  }
);

InventarioIT.belongsTo(Usuario, { foreignKey: "usuario", as: "usuario_inventario" });

export default InventarioIT;