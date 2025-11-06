import Notificacion from "@/models/Notificacion";
import sequelize from "@/lib/sequelize"; // Asegúrate de importar la instancia de Sequelize

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { id, idUsuario } = req.body;

  if (!id || !idUsuario) {
    return res.status(400).json({ error: "Faltan parámetros requeridos" });
  }

  try {
    // Iniciar una transacción
    const transaction = await sequelize.transaction();

    try {
      // Actualizar la notificación
      const [updatedRows] = await Notificacion.update(
        { leido: 1 },
        {
          where: { id, id_usuario: idUsuario },
          transaction,
        }
      );

      if (updatedRows === 0) {
        // Si no se encontró la notificación, revertir la transacción
        await transaction.rollback();
        return res.status(404).json({ error: "Notificación no encontrada" });
      }

      // Confirmar la transacción
      await transaction.commit();

      res.status(200).json({ success: true, message: "Notificación marcada como leída" });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error al marcar la notificación como leída:", error);
    res.status(500).json({ error: "Error al marcar la notificación como leída" });
  }
}