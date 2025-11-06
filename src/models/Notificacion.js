import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize"; // Asegúrate de tener tu conexión en este archivo
import RegistroEventos from "@/models/RegistroEventos";
import Usuario from "@/models/Usuarios";

const Notificacion = sequelize.define(
  "Notificacion",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_evento: { type: DataTypes.INTEGER, allowNull: false },
    leido: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "notificacion",
    timestamps: false, // Si tu tabla no usa `createdAt` y `updatedAt`
  }
);

Notificacion.belongsTo(RegistroEventos, { foreignKey: "id_evento", as: "evento", });
Notificacion.belongsTo(Usuario, { foreignKey: "id_usuario" });

export default Notificacion;