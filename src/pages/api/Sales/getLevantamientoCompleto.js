import Prospecto from "@/models/Prospectos";
import Levantamiento from "@/models/Levantamientos";
import NombreProducto from "@/models/NombreProducto";
import Referencia from "@/models/Referencias";
import Distribuidor from "@/models/Distribuidores";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID de levantamiento requerido" });
  }

  try {
    const levantamiento = await Levantamiento.findOne({
      where: { id },
      include: [
        {
          model: Prospecto,
          as: "prospecto",
          attributes: ["id", "nombre", "telefono", "correo", "marca", "redes_sociales", "constancia", "odoo_id"],
        },
        {
          model: NombreProducto,
          as: "productos",
        },
        {
          model: Referencia,
          as: "referencias",
        },
        {
          model: Distribuidor,
          as: "distribuidor",
        },
      ],
    });

    if (!levantamiento) {
      return res.status(404).json({ message: "Levantamiento no encontrado" });
    }

    return res.status(200).json({ success: true, levantamiento });
  } catch (error) {
    console.error("Error al obtener el levantamiento:", error);
    return res.status(500).json({ message: "Error al obtener el levantamiento" });
  }
}