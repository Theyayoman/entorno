import fs from "fs";
import { Client } from "basic-ftp";
import formidable from "formidable";
import path from "path";
import sharp from "sharp";

// Desactiva el body parser de Next.js para usar formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const form = new formidable.IncomingForm({
    multiples: false, // Solo un archivo
    uploadDir: "/tmp",
    // uploadDir: path.join(process.cwd(), "uploads"),
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error al procesar el formulario:", err);
      return res
        .status(500)
        .json({ message: "Error al procesar el formulario" });
    }

    const file = files.comprobante;

    if (!file || !file.path) {
      return res.status(400).json({ message: "Archivo no válido" });
    }

    const fileExt = path.extname(file.name).toLowerCase();
    const allowedImageExts = [".jpg", ".jpeg", ".png", ".webp"];

    const now = new Date();
    const formattedDate = now.toISOString().replace(/[-:T]/g, "").split(".")[0];
    const newFileName = `${formattedDate}_${file.name}`;
    const outputPath = path.join("/tmp", `processed_${newFileName}`);
    // para que esto funcione en local
    /*const outputPath = path.join(
      process.cwd(),
      "uploads",
      `processed_${newFileName}`
    );*/

    try {
      // Si es imagen, comprimirla; si no, copiar directamente
      if (allowedImageExts.includes(fileExt)) {
        await sharp(file.path)
          .toFormat(fileExt.replace(".", ""), { quality: 60 })
          .toFile(outputPath);
      } else {
        fs.copyFileSync(file.path, outputPath);
      }

      // Conexión FTP
      const client = new Client();
      client.ftp.verbose = true;

      await client.access({
        host: "50.6.199.166",
        user: "aionnet",
        password: "Rrio1003",
        secure: false,
      });

      const remotePath = `/uploads/papeletas/${newFileName}`;
      await client.uploadFrom(outputPath, remotePath);
      client.close();

      // Borrar el archivo temporal
      try {
        fs.unlinkSync(file.path);
        fs.unlinkSync(outputPath);
      } catch (unlinkErr) {
        console.error("Error al eliminar archivo temporal:", unlinkErr);
      }

      res.status(200).json({
        message: "Archivo subido correctamente al FTP",
        fileName: newFileName,
      });
    } catch (error) {
      console.error("Error al subir al FTP o procesar archivo:", error);
      res
        .status(500)
        .json({ error: "No se pudo subir el archivo al FTP", error });
    }
  });
}
