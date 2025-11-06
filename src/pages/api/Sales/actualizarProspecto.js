import Prospecto from "@/models/Prospectos";
import * as ftp from "basic-ftp";
import fs from "fs";
import path from "path";
const { uploadDir } = require("@/lib/configUpload");

// Funcion para obtener la extension de la imagen
const getExtensionFromBase64 = (base64) => {
  const match = base64?.match(/^data:([a-zA-Z0-9/+.-]+)\/([a-zA-Z0-9.+-]+);base64,/);
  return match ? match[2] : null; // ejemplo: "pdf", "png", "jpeg", etc.
};

// Funcion para subir la imagen al FTP
async function subirImagenFTP(nombreArchivo, base64) {
  if (!base64 || typeof base64 !== "string" || !base64.startsWith("data:application/pdf")) {
    console.warn("No se recibió un PDF nuevo. No se subirá nada al FTP.");
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

    const tempPath = path.join(uploadDir, nombreArchivo); // ✅ dinámico según entorno
    fs.writeFileSync(tempPath, buffer);
    
    await client.uploadFrom(tempPath, `/uploads/ventas/prospectos/constancias/${nombreArchivo}`);
    fs.unlinkSync(tempPath); // eliminar archivo temporal
    
    await client.close();
    return `/uploads/ventas/prospectos/constancias/${nombreArchivo}`;
  } catch (err) {
    console.error("Error subiendo PDF al FTP:", err);
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { id, prospecto, imagenSeleccionadaPreview } = req.body;

  try {
    // Si hay PDF, primero subirlo y obtener ruta
    if (imagenSeleccionadaPreview) {
      const extension = getExtensionFromBase64(imagenSeleccionadaPreview);
      const safeNombre = prospecto?.nombre.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");
      const nombreArchivo = `${safeNombre}_constancia_situacion_fiscal_${Date.now()}.${extension}`;
      const rutaFtp = await subirImagenFTP(nombreArchivo, imagenSeleccionadaPreview);

      if (rutaFtp) {
        prospecto.constancia = rutaFtp;
      }
    }

    // Crear prospecto (con o sin constancia)
    const [updatedRows] = await Prospecto.update({
      nombre: prospecto.nombre || null,
      telefono: prospecto.telefono || null,
      correo: prospecto.correo || null,
      marca: prospecto.marca || null,
      redes_sociales: prospecto.redes_sociales || null,
      constancia: prospecto.constancia || null,
    }, { where: { id } });

    if (updatedRows === 0) {
      return res.status(500).json({ error: "Error al actualizar el prospecto" });
    }

    res.status(200).json({ success: true, message: "Prospecto creado exitosamente" });
  } catch (error) {
    console.error("Error al crear el prospecto:", error);
    res.status(500).json({ error: "Error al crear el prospecto" });
  }
}