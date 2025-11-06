import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize"; // Asegúrate de tener tu conexión en este archivo
import Departamento from "@/models/Departamentos"; // Importa el modelo de Departamento
import Empresa from "@/models/Empresas"; // Importa el modelo de Empresa
import Permiso from "@/models/Permisos";

const Usuario = sequelize.define(
  "Usuario",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rol: { type: DataTypes.STRING, allowNull: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    apellidos: { type: DataTypes.STRING, allowNull: false },
    numero_empleado: { type: DataTypes.STRING, allowNull: true, unique: true },
    correo: { type: DataTypes.STRING, unique: true, allowNull: true },
    departamento_id: { type: DataTypes.INTEGER, allowNull: true },
    id_permiso: { type: DataTypes.INTEGER, allowNull: true },
    puesto: { type: DataTypes.STRING, allowNull: true },
    telefono: { type: DataTypes.INTEGER, allowNull: true },
    fecha_ingreso: { type: DataTypes.DATE, allowNull: true },
    jefe_directo: { type: DataTypes.INTEGER, allowNull: true },
    empresa_id: { type: DataTypes.INTEGER, allowNull: true },
    planta: { type: DataTypes.INTEGER, allowNull: true },
    password: { type: DataTypes.STRING, allowNull: false },
    plataformas: { 
      type: DataTypes.TEXT, // Usamos TEXT en lugar de JSON
      allowNull: true,
      get() {
        // Intentamos parsear el JSON si es posible
        const rawValue = this.getDataValue("plataformas");
        try {
          return JSON.parse(rawValue);
        } catch (error) {
          return rawValue; // Si falla, devolvemos el valor original como texto
        }
      },
      set(value) {
        if (typeof value === "object") {
          this.setDataValue("plataformas", JSON.stringify(value)); // Guardamos como JSON
        } else {
          this.setDataValue("plataformas", value); // Guardamos como texto si ya es string
        }
      }
    },
    eliminado: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
  },
  {
    tableName: "usuarios",
    timestamps: false, // Si tu tabla no usa `createdAt` y `updatedAt`
  }
);

Usuario.belongsTo(Departamento, { foreignKey: "departamento_id" });
Usuario.belongsTo(Empresa, { foreignKey: "empresa_id" });
Usuario.belongsTo(Permiso, { foreignKey: 'id_permiso' });

export default Usuario;