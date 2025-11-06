import Prospecto from "@/models/Prospectos";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID de prospecto requerido' });
  }

  try {
    // Borrado lógico usando deletedAt
    const deletedCount = await Prospecto.destroy({
      where: { id }
    });

    if (deletedCount > 0) {
      return res.status(200).json({ success: true, message: 'Prospecto eliminado (soft delete)' });
    } else {
      return res.status(404).json({ success: false, message: 'Prospecto no encontrado' });
    }
  } catch (error) {
    console.error('Error eliminando el prospecto:', error);
    return res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
}