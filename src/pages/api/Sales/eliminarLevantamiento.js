import Levantamiento from "@/models/Levantamientos";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID de levantamiento requerido' });
  }

  try {
    // Borrado lógico usando deletedAt
    const deletedCount = await Levantamiento.destroy({
      where: { id }
    });

    if (deletedCount > 0) {
      return res.status(200).json({ success: true, message: 'Levantamiento eliminado (soft delete)' });
    } else {
      return res.status(404).json({ success: false, message: 'Levantamiento no encontrado' });
    }
  } catch (error) {
    console.error('Error eliminando el levantamiento:', error);
    return res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
}