import Prospecto from "@/models/Prospectos";
import Levantamiento from "@/models/Levantamientos";
import Usuario from "@/models/Usuarios";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const levantamientos = await Levantamiento.findAll({
      include: [
        {
          model: Prospecto,
          as: "prospecto",
          attributes: ["id", "nombre", "correo", "marca", "constancia", "odoo_id"],
        },
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id", "nombre", "apellidos"],
        }
      ],
      order: [["createdAt", "DESC"]],
    });

    // Convertir datos a un array de objetos
    const result = levantamientos.map((levantamiento) => ({
        ...levantamiento.toJSON(),
        id_prospecto: levantamiento.prospecto?.id || null,
        nombre_prospecto: levantamiento.prospecto?.nombre || null,
        correo_prospecto: levantamiento.prospecto?.correo || null,
        marca_prospecto: levantamiento.prospecto?.marca || null,
        constancia_prospecto: levantamiento.prospecto?.constancia || null,
        odoo_id_prospecto: levantamiento.prospecto?.odoo_id || null,
        nombre_creado_por: levantamiento.usuario?.nombre || null,
        apellidos_creado_por: levantamiento.usuario?.apellidos || null
    }));

    return res.status(200).json({ success: true, levantamientos: result });
  } catch (error) {
    console.error("Error al obtener los levantamientos:", error);
    return res.status(500).json({ message: "Error al obtener los levantamientos" });
  }
}