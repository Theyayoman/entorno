import Actor from "@/models/Actores";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID de actor requerido' });
  }

  try {
    // Actualizar el campo `eliminado` del producto
    const [updatedRows] = await Actor.update(
      { eliminado: 1 }, // Valores a actualizar
      { where: { id } }  // Condición de actualización
    );

    if (updatedRows > 0) {
      return res.status(200).json({ success: true, message: 'Actor marcado como eliminado correctamente' });
    } else {
      return res.status(404).json({ success: false, message: 'Actor no encontrado' });
    }
  } catch (error) {
    console.error('Error marcando el actor como eliminado:', error);
    return res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
}