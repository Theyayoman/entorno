import RegistroEventos from "@/models/RegistroEventos";
import Notificacion from "@/models/Notificacion";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "ID de usuario es requerido" });
  }

  try {
    // Consultar las notificaciones no leídas del usuario
    const notificaciones = await Notificacion.findAll({
      where: {
        id_usuario: id,
      },
      include: [
        {
          model: RegistroEventos,
          as: "evento", // Asegurar que coincida con el alias en la relación
          attributes: ["id", "descripcion", "fecha", "tipo"],
        },
      ],
      order: [[{ model: RegistroEventos, as: "evento" }, "fecha", "DESC"]],
    });

    // Mapear los resultados al formato esperado
    const resultado = notificaciones.map((noti) => ({
      id: noti.evento?.id, // Acceder correctamente con el alias definido en "as"
      descripcion: noti.evento?.descripcion,
      leido: noti.leido,
      fecha: noti.evento?.fecha,
      tipo: noti.evento?.tipo,
      id_notificacion: noti.id,
    }));

    res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    res.status(500).json({ error: "Error al obtener las notificaciones" });
  }
}