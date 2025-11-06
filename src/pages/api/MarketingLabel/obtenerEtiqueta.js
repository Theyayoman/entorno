import pool from '@/lib/db'; // Asegúrate de que db esté configurado correctamente

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
    // Obtener una conexión del pool
    connection = await pool.getConnection();

    // Consulta para obtener el formulario desde la tabla 'formularios_papeletas'
    const [rows] = await connection.query('SELECT formulario FROM formularios_papeletas WHERE id = ?', [id]);

    // Si no hay resultados, se devuelve un error 404
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Formulario no encontrado' });
    }

    // Extraemos el formulario (puede ser un objeto o un valor vacío si no existe)
    const datos = rows[0]?.formulario || {};

    res.status(200).json(datos);
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    res.status(500).json({ message: 'Error al obtener los datos' });
  } finally {
    // Liberar la conexión
    if (connection) {
      connection.release();
    }
  }
}