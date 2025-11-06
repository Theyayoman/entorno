import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize";
import Prospecto from "@/models/Prospectos";
import Usuario from "@/models/Usuarios";
import NombreProducto from "@/models/NombreProducto";
import Referencia from "@/models/Referencias";
import Distribuidor from "@/models/Distribuidores";

const Levantamiento = sequelize.define(
  "Levantamiento",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    creado_por: { type: DataTypes.INTEGER, allowNull: true },
    publico_objetivo: { type: DataTypes.STRING, allowNull: true },
    canales_distribucion: { type: DataTypes.STRING, allowNull: true },
    monto_inversion: { type: DataTypes.STRING, allowNull: true },
    prospecto_id: { type: DataTypes.INTEGER, allowNull: true },
    formula: { type: DataTypes.INTEGER, allowNull: true },
    formula_text: { type: DataTypes.STRING, allowNull: true },
    dosificacion: { type: DataTypes.INTEGER, allowNull: true },
    dosificacion_text: { type: DataTypes.STRING, allowNull: true },
    loteado: { type: DataTypes.INTEGER, allowNull: true },
    loteado_lenguaje: { type: DataTypes.INTEGER, allowNull: true },
    loteado_caducidad: { type: DataTypes.INTEGER, allowNull: true },
    etiqueta: { type: DataTypes.INTEGER, allowNull: true },
    cofepris: { type: DataTypes.INTEGER, allowNull: true },
    ecommerce: { type: DataTypes.INTEGER, allowNull: true },
    codigo_barras: { type: DataTypes.STRING, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: true },
    updatedAt: { type: DataTypes.DATE, allowNull: true },
    deletedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: "levantamientos",
    timestamps: true, // createdAt, updatedAt
    paranoid: true, // deletedAt
  }
);

Levantamiento.belongsTo(Prospecto, { foreignKey: "prospecto_id", as: "prospecto" });
Levantamiento.belongsTo(Usuario, { foreignKey: "creado_por", as: "usuario" });
Levantamiento.hasMany(NombreProducto, { foreignKey: "levantamiento_id", as: "productos" });
Levantamiento.hasMany(Referencia, { foreignKey: "levantamiento_id", as: "referencias" });
Levantamiento.hasOne(Distribuidor, { foreignKey: "levantamiento_id", as: "distribuidor" });

export default Levantamiento;