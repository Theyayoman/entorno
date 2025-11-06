import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize";

const Distribuidor = sequelize.define(
  "Distribuidor",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    levantamiento_id: { type: DataTypes.INTEGER, allowNull: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    direccion: { type: DataTypes.STRING, allowNull: false },
    telefono: { type: DataTypes.STRING, allowNull: false },
    ecommerce: { type: DataTypes.STRING, allowNull: true },
    correo: { type: DataTypes.STRING, allowNull: true },
    redes: { type: DataTypes.STRING, allowNull: true },
    qr: { type: DataTypes.STRING, allowNull: true },
    nota: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "distribuidores",
    timestamps: false,
  }
);

export default Distribuidor;