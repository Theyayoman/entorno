import Distribuidor from "@/models/Distribuidores";
import * as ftp from "basic-ftp";
import fs from "fs";
import path from "path";
const { uploadDir } = require("@/lib/configUpload");

// Funcion para obtener la extension de la imagen
const getExtensionFromBase64 = (base64) => {
  const match = base64?.match(/^data:([a-zA-Z0-9/+.-]+)\/([a-zA-Z0-9.+-]+);base64,/);
  if (!match) return null;

  const type = match[2].toLowerCase();

  switch (type) {
    case "svg+xml":
      return "svg";
    case "jpeg":
      return "jpg";
    case "pdf":
    case "png":
    case "jpg":
      return type;
    default:
      return null;
  }
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

    await client.uploadFrom(tempPath, `/uploads/ventas/codigosQR/${nombreArchivo}`);
    fs.unlinkSync(tempPath);

    await client.close();
    return `/uploads/ventas/codigosQR/${nombreArchivo}`;
  } catch (err) {
    console.error("Error subiendo archivo al FTP:", err);
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { idLevantamiento, distribuidor, imagenSeleccionadaPreview } = req.body;

  if (!distribuidor) {
    return res.status(400).json({ error: "Faltan parámetros requeridos" });
  }

  try {
    // Si hay archivo, primero subirlo y obtener ruta
    if (imagenSeleccionadaPreview) {
      const extension = getExtensionFromBase64(imagenSeleccionadaPreview);
      const safeNombre = distribuidor?.nombre.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");
      const nombreArchivo = `${safeNombre}_codigo_QR_${Date.now()}.${extension}`;
      const rutaFtp = await subirImagenFTP(nombreArchivo, imagenSeleccionadaPreview);

      if (rutaFtp) {
        distribuidor.qr = rutaFtp;
      }
    }

    // Buscar o crear distribuidor para este índice
    let distribuidorBD = await Distribuidor.findOne({
        where: { levantamiento_id: idLevantamiento },
    });

    const dataDistribuidor = {
        levantamiento_id: idLevantamiento || null,
        nombre: distribuidor.nombre || null,
        direccion: distribuidor.direccion || null,
        telefono: distribuidor.telefono || null,
        ecommerce: distribuidor.ecommerce || null,
        correo: distribuidor.correo || null,
        redes: distribuidor.redes || null,
        qr: distribuidor.qr || null,
        nota: distribuidor.nota || null,
    };

    if (!distribuidorBD) {
        await Distribuidor.create(dataDistribuidor);
    } else {
        await distribuidorBD.update(dataDistribuidor);
    }

    res.status(200).json({ success: true, message: "Distribuidor guardado exitosamente" });
  } catch (error) {
    console.error("Error al guardar el distribuidor:", error);
    res.status(500).json({ error: "Error al guardar el distribuidor" });
  }
}