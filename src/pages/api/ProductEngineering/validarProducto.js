import IdentificadorProducto from "@/models/IdentificadoresProductos";
import Producto from "@/models/Productos";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { idUser, idProductoValidar, productoAValidar } = req.body;

  if (!idProductoValidar || !productoAValidar) {
    return res.status(400).json({ error: "Faltan parámetros requeridos" });
  }

  try {
    for (const identificador of productoAValidar.identificadoresProductos) {
      const [registro, creado] = await IdentificadorProducto.findOrCreate({
        where: {
          producto_id: idProductoValidar,
          identificador_id: identificador.identificador_id,
        },
        defaults: {
          registroV: identificador.registroV || null,
          registroN: identificador.registroN || null,
        },
      });

      if (!creado) {
        // Ya existía, hacemos update
        await registro.update({
          registroV: identificador.registroV || null,
          registroN: identificador.registroN || null,
        });
      }
    }

    const producto = await Producto.findByPk(idProductoValidar);
    await producto.update({ veredicto: productoAValidar.producto.veredicto, validado_por: idUser, evaluacion: new Date() });

    res.status(200).json({ success: true, message: "Producto validado correctamente" });
  } catch (error) {
    console.error("Error al validar el producto:", error);
    res.status(500).json({ error: "Error al validar el producto" });
  }
}