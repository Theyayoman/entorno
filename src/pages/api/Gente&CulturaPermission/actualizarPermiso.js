import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID es requerido' });
  }

  const { formData } = req.body;
  console.log(formData);

  let connection;

  try {
    // Obtiene una conexión del pool
    connection = await pool.getConnection();

    // Actualiza el formulario en la base de datos
    await connection.execute(
      "UPDATE formularios_papeletas SET formulario = ?, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?",
      [JSON.stringify(formData), id]
    );

    res.status(201).json({ message: 'Formulario guardado correctamente' });
  } catch (error) {
    console.error('Error guardando el formulario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  } finally {
    // Liberar la conexión
    if (connection) connection.release();
  }
}