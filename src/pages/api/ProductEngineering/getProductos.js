import Producto from "@/models/Productos";
import Proveedor from "@/models/Proveedores";
import TipoMateriaPrima from "@/models/TiposMateriasPrimas";
import CategoriaMateriaPrima from "@/models/CategoriasMateriasPrimas";
import SubcategoriaMateriaPrima from "@/models/SubcategoriasMateriasPrimas";
import ImagenProducto from "@/models/ImagenesProductos";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const productos = await Producto.findAll({
      where: { eliminado: 0, catalogo: 1 },
      include: [
        { model: Proveedor, as: "proveedor", attributes: ["nombre"] },
        { model: TipoMateriaPrima, as: "categoria", attributes: ["nombre"] },
        { model: CategoriaMateriaPrima, as: "subcategoria", attributes: ["nombre"] },
        { model: SubcategoriaMateriaPrima, as: "especificacion", attributes: ["nombre"] },
        {
          model: ImagenProducto,
          as: "imagenes",
          attributes: ["ruta", "tipo"],
          separate: true, // Para que no afecte el `GROUP BY`
        },
      ],
      order: [["id", "ASC"]],
    });

    // Convertir imágenes a un array de strings
    const result = productos.map((product) => ({
      ...product.toJSON(),
      nombre_proveedor: product.proveedor?.nombre || null,
      nombre_categoria: product.categoria?.nombre || null,
      nombre_subcategoria: product.subcategoria?.nombre || null,
      nombre_especificacion: product.especificacion?.nombre || null,
      imagenes: product.imagenes.filter((img) => img.tipo === 1 || img.tipo === 3).map(img => img.ruta), // Transformar imágenes a array
    }));

    return res.status(200).json({ success: true, products: result });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    return res.status(500).json({ message: "Error al obtener los productos" });
  }
}