import Notificacion from "@/models/Notificacion";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { id, idUsuario } = req.body;

  if (!id || !idUsuario) {
    return res.status(400).json({ error: "Faltan parámetros requeridos" });
  }

  try {
    // Eliminar la notificación
    const deletedRows = await Notificacion.destroy({
      where: { id, id_usuario: idUsuario },
    });

    if (deletedRows === 0) {
      return res.status(404).json({ error: "Notificación no encontrada" });
    }

    res.status(200).json({ success: true, message: "Notificación eliminada" });
  } catch (error) {
    console.error("Error al eliminar la notificación:", error);
    res.status(500).json({ error: "Error al eliminar la notificación" });
  }
}