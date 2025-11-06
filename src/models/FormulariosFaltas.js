import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize"; // Asegúrate de tener tu conexión en este archivo
import Usuario from "@/models/Usuarios";

const FormulariosFaltas = sequelize.define(
  "FormulariosFaltas",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    formulario_id: { type: DataTypes.UUID, allowNull: true },
    formulario: { 
        type: DataTypes.TEXT, // Usamos TEXT en lugar de JSON
        allowNull: false,
        get() {
            // Intentamos parsear el JSON si es posible
            const rawValue = this.getDataValue("formulario");
            try {
            return JSON.parse(rawValue);
            } catch (error) {
            return rawValue; // Si falla, devolvemos el valor original como texto
            }
        },
        set(value) {
            if (typeof value === "object") {
            this.setDataValue("formulario", JSON.stringify(value)); // Guardamos como JSON
            } else {
            this.setDataValue("formulario", value); // Guardamos como texto si ya es string
            }
        }
    },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false },
    fecha_subida: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
    fecha_actualizacion: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
    fecha_inicio: { type: DataTypes.DATE, allowNull: true },
    fecha_fin: { type: DataTypes.DATE, allowNull: true },
    estatus: { type: DataTypes.TEXT, allowNull: true },
    archivo: { type: DataTypes.TEXT, allowNull: true },
    eliminado: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    comentarios: { type: DataTypes.TEXT, allowNull: true },
    tipo: { type: DataTypes.TEXT, allowNull: true },
    extemporanea: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
  },
  {
    tableName: "formularios_faltas",
    timestamps: false, // Si tu tabla no usa `createdAt` y `updatedAt`
  }
);

FormulariosFaltas.belongsTo(Usuario, { foreignKey: "id_usuario" });

export default FormulariosFaltas;