import Levantamiento from "@/models/Levantamientos";
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

  const { levantamiento, imagenSeleccionadaPreview } = req.body;

  if (!levantamiento) {
    return res.status(400).json({ error: "Faltan parámetros requeridos" });
  }

  try {
    // Si hay PDF, primero subirlo y obtener ruta
    if (imagenSeleccionadaPreview) {
      const extension = getExtensionFromBase64(imagenSeleccionadaPreview);
      const safeNombre = levantamiento?.nombre_prospecto.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");
      const nombreArchivo = `${safeNombre}_constancia_situacion_fiscal_${Date.now()}.${extension}`;
      const rutaFtp = await subirImagenFTP(nombreArchivo, imagenSeleccionadaPreview);

      if (rutaFtp) {
        levantamiento.constancia_prospecto = rutaFtp;
      }
    }

    // Actualizar prospecto (con o sin constancia)
    await Prospecto.update({
        nombre: levantamiento.nombre_prospecto || null,
        telefono: levantamiento.telefono_prospecto || null,
        correo: levantamiento.correo_prospecto || null,
        marca: levantamiento.marca_prospecto || null,
        redes_sociales: levantamiento.redes_sociales_prospecto || null,
        constancia: levantamiento.constancia_prospecto || null,
    }, { where: { id: levantamiento.prospecto_id } });

    await Levantamiento.update({
        publico_objetivo: levantamiento.publico_objetivo || null,
        canales_distribucion: levantamiento.canales_distribucion || null,
        monto_inversion: levantamiento.monto_inversion || null,
    }, { where: { id: levantamiento.id } });

    res.status(200).json({ success: true, message: "Registro actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar el registro:", error);
    res.status(500).json({ error: "Error al actualizar el registro" });
  }
}