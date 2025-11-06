import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize";
import Proveedor from "@/models/Proveedores";
import TipoMateriaPrima from "@/models/TiposMateriasPrimas";
import CategoriaMateriaPrima from "@/models/CategoriasMateriasPrimas";
import SubcategoriaMateriaPrima from "@/models/SubcategoriasMateriasPrimas";
import ImagenProducto from "@/models/ImagenesProductos";

const Producto = sequelize.define(
  "Producto",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: true },
    proveedor_id: { type: DataTypes.INTEGER, allowNull: true },
    Tipo_id: { type: DataTypes.INTEGER, allowNull: true },
    Categoria_id: { type: DataTypes.INTEGER, allowNull: true },
    Subcategoria_id: { type: DataTypes.INTEGER, allowNull: true },
    codigo: { type: DataTypes.STRING, allowNull: true },
    costo: { type: DataTypes.DOUBLE, allowNull: true },
    cMinima: { type: DataTypes.INTEGER, allowNull: true },
    medicion: { type: DataTypes.STRING, allowNull: true },
    descripcion: { type: DataTypes.STRING, allowNull: true },
    MaM: { type: DataTypes.INTEGER, allowNull: true },
    evaluacion: { type: DataTypes.DATE, allowNull: true },
    veredicto: { type: DataTypes.INTEGER, allowNull: true },
    desviacion: { type: DataTypes.DOUBLE, allowNull: true },
    eliminado: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    catalogo: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    condiciones: { type: DataTypes.STRING, allowNull: true },
    materia_extraña: { type: DataTypes.STRING, allowNull: true },
    consideracion: { type: DataTypes.STRING, allowNull: true },
    modo_empleo: { type: DataTypes.STRING, allowNull: true },
    composicion: { type: DataTypes.STRING, allowNull: true },
    doc_id: { type: DataTypes.INTEGER, allowNull: true },
    creado_por: { type: DataTypes.INTEGER, allowNull: true },
    validado_por: { type: DataTypes.INTEGER, allowNull: true },
    tolerancias_por: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    tableName: "productos",
    timestamps: false, // Si tu tabla no usa `createdAt` y `updatedAt`
  }
);

Producto.belongsTo(Proveedor, { foreignKey: "proveedor_id", as: "proveedor" });
Producto.belongsTo(TipoMateriaPrima, { foreignKey: "Tipo_id", as: "categoria" });
Producto.belongsTo(CategoriaMateriaPrima, { foreignKey: "Categoria_id", as: "subcategoria" });
Producto.belongsTo(SubcategoriaMateriaPrima, { foreignKey: "Subcategoria_id", as: "especificacion" });
Producto.hasMany(ImagenProducto, { foreignKey: "producto_id", as: "imagenes" });

export default Producto;