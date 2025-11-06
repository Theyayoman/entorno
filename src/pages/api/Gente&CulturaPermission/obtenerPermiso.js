import pool from '@/lib/db';  // O cualquier cliente de MySQL que estés usando

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID es requerido' });
  }

  let connection;

  try {
    // Obtiene una conexión del pool
    connection = await pool.getConnection();

    const query = 'SELECT * FROM formularios_papeletas WHERE id = ?';
    const [result] = await connection.execute(query, [id]);

    const datos = result[0] || {};
    res.status(200).json(datos);
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    res.status(500).json({ message: 'Error al obtener los datos' });
  } finally {
    // Liberar la conexión
    if (connection) connection.release();
  }
}