import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize";
import Departamento from "@/models/Departamentos";

const Vacante = sequelize.define(
  "Vacante",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    vacante: { type: DataTypes.STRING, allowNull: false },
    cantidad: { type: DataTypes.INTEGER, allowNull: false },
    gerencia: { type: DataTypes.STRING, allowNull: false },
    proceso_actual: { type: DataTypes.INTEGER, allowNull: false },
    ubicacion: { type: DataTypes.STRING, allowNull: true },
    salario: { type: DataTypes.STRING, allowNull: false },
    fecha_apertura: { type: DataTypes.DATE, allowNull: false },
    fecha_ingreso: { type: DataTypes.DATE, allowNull: true },
    observaciones: { type: DataTypes.STRING, allowNull: false },
    eliminado: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
  },
  {
    tableName: "vacantes",
    timestamps: false, // Si tu tabla no usa `createdAt` y `updatedAt`
  }
);

Vacante.belongsTo(Departamento, { foreignKey: "gerencia", as: "departamento" });

export default Vacante;