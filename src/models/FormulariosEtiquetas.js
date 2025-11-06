import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize"; // Asegúrate de tener tu conexión en este archivo

const FormulariosEtiquetas = sequelize.define(
  "FormulariosEtiquetas",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    datos_formulario: { 
        type: DataTypes.TEXT, // Usamos TEXT en lugar de JSON
        allowNull: false,
        get() {
            // Intentamos parsear el JSON si es posible
            const rawValue = this.getDataValue("datos_formulario");
            try {
            return JSON.parse(rawValue);
            } catch (error) {
            return rawValue; // Si falla, devolvemos el valor original como texto
            }
        },
        set(value) {
            if (typeof value === "object") {
            this.setDataValue("datos_formulario", JSON.stringify(value)); // Guardamos como JSON
            } else {
            this.setDataValue("datos_formulario", value); // Guardamos como texto si ya es string
            }
        }
    },
    pdf_path: { type: DataTypes.TEXT, allowNull: false },
    eliminado: { type: DataTypes.INTEGER, allowNull: false },
    estatus: { type: DataTypes.TEXT, allowNull: false },
    fecha_envio: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
    fecha_actualizacion: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
    firmas: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
  },
  {
    tableName: "etiquetas_form",
    timestamps: false, // Si tu tabla no usa `createdAt` y `updatedAt`
  }
);

export default FormulariosEtiquetas;