import FormulariosFaltas from "@/models/FormulariosFaltas"; // Asegúrate de importar el modelo de Sequelize

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, estatus, comentarios } = req.body;

    try {
      // Usamos el método update de Sequelize para actualizar el registro
      const [updated] = await FormulariosFaltas.update(
        { 
          estatus,
          fecha_actualizacion: new Date(), // Asignamos la fecha de actualización con el valor actual
          comentarios
        },
        {
          where: { id }
        }
      );

      if (updated > 0) {
        return res.status(200).json({ message: 'Usuario actualizado exitosamente' });
      } else {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (err) {
      console.error('Error al actualizar el usuario:', err);
      return res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
  } else {
    return res.status(405).json({ message: 'Método no permitido' });
  }
}