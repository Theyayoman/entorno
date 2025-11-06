import pool from '@/lib/db';  // O cualquier cliente de MySQL que estés usando

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { formData, emailUsuario } = req.query;
    const estatus = "Pendiente";
    let connection;

    try {
      // Obtiene una conexión del pool
      connection = await pool.getConnection();

      // Consulta para obtener el usuario por correo electrónico
      const query2 = "SELECT * FROM usuarios WHERE correo = ?";
      const [result2] = await connection.execute(query2, [emailUsuario]);

      if (result2.length > 0) {
        const id = result2[0].id;

        // Consulta para insertar el formulario en la base de datos
        const query = "INSERT INTO formularios_papeletas (formulario, id_usuario, estatus) VALUES (?, ?, ?)";
        const [result] = await connection.execute(query, [JSON.stringify(formData), id, estatus]);

        res.status(200).json({ message: "Formulario guardado", result: result });
      } else {
        console.log("No se encontró el usuario solicitado");
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al guardar el formulario" });
    } finally {
      // Liberar la conexión
      if (connection) connection.release();
    }
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
}