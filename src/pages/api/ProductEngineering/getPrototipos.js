import Prototipo from "@/models/Prototipos";
import Producto from "@/models/Productos";

export default async function handler(req, res) {
  try {
    const productos = await Prototipo.findAll({
      include: [
        {
          model: Producto,
          as: "envase",
        },
        {
          model: Producto,
          as: "tapa",
        },
        {
          model: Producto,
          as: "sello",
        },
        {
          model: Producto,
          as: "aditamento",
        },
        {
          model: Producto,
          as: "formula",
        },
        {
          model: Producto,
          as: "formato",
        },
      ],
    });

    res.status(200).json(productos);
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error al obtener los productos : " + error,
      });
  }
}
