import Prospecto from "@/models/Prospectos";
import Levantamiento from "@/models/Levantamientos";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID de levantamiento requerido" });
  }

  try {
    const levantamiento_requerimiento = await Levantamiento.findOne({
      where: { id },
      include: [
        {
          model: Prospecto,
          as: "prospecto",
          attributes: ["id", "nombre", "telefono", "correo", "marca", "redes_sociales", "constancia", "odoo_id"],
        },
      ],
    });

    if (!levantamiento_requerimiento) {
      return res.status(404).json({ message: "Levantamiento no encontrado" });
    }

    const result = {
      ...levantamiento_requerimiento.toJSON(),
      id_prospecto: levantamiento_requerimiento.prospecto?.id || null,
      nombre_prospecto: levantamiento_requerimiento.prospecto?.nombre || null,
      telefono_prospecto: levantamiento_requerimiento.prospecto?.telefono || null,
      correo_prospecto: levantamiento_requerimiento.prospecto?.correo || null,
      marca_prospecto: levantamiento_requerimiento.prospecto?.marca || null,
      redes_sociales_prospecto: levantamiento_requerimiento.prospecto?.redes_sociales || null,
      constancia_prospecto: levantamiento_requerimiento.prospecto?.constancia || null,
      odoo_id_prospecto: levantamiento_requerimiento.prospecto?.odoo_id || null,
    };

    return res.status(200).json({ success: true, levantamiento: result });
  } catch (error) {
    console.error("Error al obtener el levantamiento:", error);
    return res.status(500).json({ message: "Error al obtener el levantamiento" });
  }
}