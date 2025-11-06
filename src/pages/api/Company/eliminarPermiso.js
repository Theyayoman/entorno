import pool from "@/lib/db"; // Tu configuración de conexión a la base de datos MySQL

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { id } = req.query;

    let connection;
    try {
      // Obtiene una conexión del pool
      connection = await pool.getConnection();

      // Actualiza la columna 'eliminado' en lugar de eliminar el registro
      const [result] = await connection.execute(
        "UPDATE formularios_papeletas SET eliminado = 1 WHERE id = ?",
        [id]
      );

      if (result.affectedRows > 0) {
        return res.status(200).json({ message: "Formulario eliminado correctamente" });
      } else {
        return res.status(404).json({ message: "Formulario no encontrado" });
      }
    } catch (error) {
      console.error("Error eliminando el formulario:", error);
      return res.status(500).json({ message: "Error al eliminar el formulario" });
    } finally {
      // Liberar la conexión
      if (connection) connection.release();
    }
  } else {
    return res.status(405).json({ message: "Método no permitido" });
  }
}