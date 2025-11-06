import Levantamiento from "@/models/Levantamientos";
import * as ftp from "basic-ftp";
import fs from "fs";
import path from "path";
const { uploadDir } = require("@/lib/configUpload");

// Funcion para obtener la extension de la imagen
const getExtensionFromBase64 = (base64) => {
  const match = base64?.match(/^data:([a-zA-Z0-9/+.-]+)\/([a-zA-Z0-9.+-]+);base64,/);
  if (!match) return null;

  let ext = match[2]; // como "svg+xml" o "pdf"
  if (ext === "svg+xml") return "svg";
  return ext;
};

// Funcion para subir la imagen al FTP
async function subirImagenFTP(nombreArchivo, base64) {
  if (!base64 || typeof base64 !== "string" || !base64.startsWith("data:")) {
    console.warn("No se recibió un archivo válido en base64.");
    return null;
  }

  const client = new ftp.Client();

  try {
    await client.access({
      host: "50.6.199.166",
      user: "aionnet",
      password: "Rrio1003",
      secure: false,
    });

    const buffer = Buffer.from(base64.split(",")[1], "base64");

    const tempPath = path.join(uploadDir, nombreArchivo); // asegúrate que nombreArchivo termine en `.svg`
    fs.writeFileSync(tempPath, buffer);

    await client.uploadFrom(tempPath, `/uploads/ventas/codigosBarras/${nombreArchivo}`);
    fs.unlinkSync(tempPath);

    await client.close();
    return `/uploads/ventas/codigosBarras/${nombreArchivo}`;
  } catch (err) {
    console.error("Error subiendo SVG al FTP:", err);
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { levantamiento, imagenSeleccionadaPreview } = req.body;

  if (!levantamiento) {
    return res.status(400).json({ error: "Faltan parámetros requeridos" });
  }

  try {
    // Si hay PDF, primero subirlo y obtener ruta
    if (imagenSeleccionadaPreview) {
      const extension = getExtensionFromBase64(imagenSeleccionadaPreview);
      const safeNombre = levantamiento?.id;
      const nombreArchivo = `${safeNombre}_codigo_barras_${Date.now()}.${extension}`;
      const rutaFtp = await subirImagenFTP(nombreArchivo, imagenSeleccionadaPreview);

      if (rutaFtp) {
        levantamiento.codigo_barras = rutaFtp;
      }
    }

    // Actualizar levantamiento (con o sin codigo de barras)
    await Levantamiento.update({
        etiqueta: levantamiento.etiqueta || null,
        cofepris: levantamiento.cofepris || null,
        ecommerce: levantamiento.ecommerce || null,
        codigo_barras: levantamiento.codigo_barras || null,
    }, { where: { id: levantamiento.id } });

    res.status(200).json({ success: true, message: "Etiquetado guardado exitosamente" });
  } catch (error) {
    console.error("Error al guardar el etiquetado:", error);
    res.status(500).json({ error: "Error al guardar el etiquetado" });
  }
}