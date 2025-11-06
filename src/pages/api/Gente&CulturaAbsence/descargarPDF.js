import { Client } from "basic-ftp";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { fileName } = req.query;

  if (!fileName) {
    return res.status(400).json({ error: "Falta el nombre del archivo" });
  }

  const client = new Client();

  try {
    await client.access({
      host: "50.6.199.166",  // Dirección del servidor FTP
      user: "aionnet",         // Usuario FTP
      password: "Rrio1003", // Contraseña FTP
      secure: false,
    });

    console.log("Conexión exitosa al FTP.");
    const filePath = `/uploads/papeletas/${fileName}`;
    const writableStream = res;

    // Descargar directamente al cliente
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    await client.downloadTo(writableStream, filePath);

    console.log(`Archivo ${fileName} enviado al cliente.`);
    client.close();
  } catch (error) {
    console.error("Error al descargar el archivo:", error.message);
    res.status(500).json({ error: "Error al descargar el archivo" });
  }
}