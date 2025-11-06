import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize"; // Asegúrate de tener tu conexión en este archivo

const FormulariosEstrategias = sequelize.define(
  "FormulariosEstrategias",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
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
    eliminado: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    fecha_actualizacion: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "formularios_estrategias",
    timestamps: false, // Si tu tabla no usa `createdAt` y `updatedAt`
  }
);

export default FormulariosEstrategias;