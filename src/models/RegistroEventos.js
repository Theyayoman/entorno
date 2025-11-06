import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize"; // Asegúrate de tener tu conexión en este archivo
import Usuario from "@/models/Usuarios";
import Departamento from "@/models/Departamentos";

const RegistroEventos = sequelize.define(
  "RegistroEventos",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fecha: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
    tipo: { type: DataTypes.TEXT, allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: false },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false },
    id_departamento: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    tableName: "registroeventos",
    timestamps: false, // Si tu tabla no usa `createdAt` y `updatedAt`
  }
);

RegistroEventos.belongsTo(Usuario, { foreignKey: "id_usuario" });
RegistroEventos.belongsTo(Departamento, { foreignKey: "id_departamento" });

export default RegistroEventos;