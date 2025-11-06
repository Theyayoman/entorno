import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize";
import Usuario from "@/models/Usuarios";

const Permiso = sequelize.define(
  "Permiso",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    vista: { 
        type: DataTypes.TEXT, // Usamos TEXT en lugar de JSON
        allowNull: true,
        get() {
            // Intentamos parsear el JSON si es posible
            const rawValue = this.getDataValue("vista");
            try {
            return JSON.parse(rawValue);
            } catch (error) {
            return rawValue; // Si falla, devolvemos el valor original como texto
            }
        },
        set(value) {
            if (typeof value === "object") {
            this.setDataValue("vista", JSON.stringify(value)); // Guardamos como JSON
            } else {
            this.setDataValue("vista", value); // Guardamos como texto si ya es string
            }
        }
    },
    campo: { 
        type: DataTypes.TEXT, // Usamos TEXT en lugar de JSON
        allowNull: true,
        get() {
            // Intentamos parsear el JSON si es posible
            const rawValue = this.getDataValue("campo");
            try {
            return JSON.parse(rawValue);
            } catch (error) {
            return rawValue; // Si falla, devolvemos el valor original como texto
            }
        },
        set(value) {
            if (typeof value === "object") {
            this.setDataValue("campo", JSON.stringify(value)); // Guardamos como JSON
            } else {
            this.setDataValue("campo", value); // Guardamos como texto si ya es string
            }
        }
    },
    seccion: { 
        type: DataTypes.TEXT, // Usamos TEXT en lugar de JSON
        allowNull: true,
        get() {
            // Intentamos parsear el JSON si es posible
            const rawValue = this.getDataValue("seccion");
            try {
            return JSON.parse(rawValue);
            } catch (error) {
            return rawValue; // Si falla, devolvemos el valor original como texto
            }
        },
        set(value) {
            if (typeof value === "object") {
            this.setDataValue("seccion", JSON.stringify(value)); // Guardamos como JSON
            } else {
            this.setDataValue("seccion", value); // Guardamos como texto si ya es string
            }
        }
    },
  },
  {
    tableName: "permiso",
    timestamps: false, // Si tu tabla no usa `createdAt` y `updatedAt`
  }
);

export default Permiso;