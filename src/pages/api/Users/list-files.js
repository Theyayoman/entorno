import pool from '@/lib/db';
const ftp = require("basic-ftp");

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  const { folderId, correo } = req.query;

  if (!correo) {
    return res.status(400).json({ success: false, message: 'Correo es requerido' });
  }

  let connection;

  try {
    // Obtener la conexión del pool
    connection = await pool.getConnection();

    // Consulta para obtener el usuario basado en el correo
    const [userResult] = await connection.execute('SELECT * FROM usuarios WHERE correo = ?', [correo]);

    if (userResult.length === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    const departamentoId = userResult[0].departamento_id;

    // Consulta para obtener el departamento
    const [deptResult] = await connection.execute('SELECT * FROM departamentos WHERE id = ?', [departamentoId]);

    if (deptResult.length === 0) {
      return res.status(404).json({ success: false, message: "Departamento no encontrado" });
    }

    const client = new ftp.Client();
    client.ftp.verbose = true;

    // Accede al servidor FTP
    await client.access({
      host: "192.168.1.87",
      user: "pruebas@nutriton.com.mx",
      password: "NutriAdmin2035",
      secure: false, // Cambia a true si el servidor FTP es seguro (FTPS)
    });

    // Define la ruta que quieres listar (usa "/" si no se especifica una carpeta)
    const directory = folderId ? `/${folderId}` : "/";

    // Lista los archivos en la carpeta especificada
    const fileList = await client.list(directory);

    // Cierra la conexión FTP
    await client.close();

    // Devuelve la lista de archivos al frontend
    return res.status(200).json({ success: true, files: fileList });

  } catch (error) {
    console.error("Error conectando al FTP:", error);
    return res.status(500).json({ success: false, error: "Error conectando al FTP" });
  } finally {
    // Liberar la conexión
    if (connection) connection.release();
  }
}