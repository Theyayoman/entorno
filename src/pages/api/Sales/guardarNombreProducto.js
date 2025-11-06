import fs from "fs";
import { Client } from "basic-ftp";
import path from "path";
import formidable from "formidable";
import NombreProducto from "@/models/NombreProducto";

export const config = {
  api: {
    bodyParser: false,
  },
};

const toNullable = (val) => {
  return (val ?? "").toString().trim() || null;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const form = new formidable.IncomingForm({
    multiples: true,
    uploadDir: "/tmp",
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error procesando el formulario:", err);
      return res.status(500).json({ message: "Error al procesar el formulario" });
    }

    const { idLevantamiento } = fields;

    if (!idLevantamiento) {
      return res.status(400).json({ message: "Falta idLevantamiento" });
    }

    try {
      const referencias = [];

      const indices = Object.keys(fields)
        .filter(key => key.startsWith("referencias["))
        .map(key => key.match(/^referencias\[(\d+)\]/)?.[1])
        .filter((v, i, a) => v !== undefined && a.indexOf(v) === i); // únicos

      const client = new Client();
      await client.access({
        host: "50.6.199.166",
        user: "aionnet",
        password: "Rrio1003",
        secure: false,
      });

      await client.ensureDir("/uploads/ventas/imagenesPropuestas");

      for (const index of indices) {
        const id = fields[`referencias[${index}][id]`] || "";
        const nombre = fields[`referencias[${index}][nombre]`] || "";
        const estatus_nombre = toNullable(fields[`referencias[${index}][estatus_nombre]`]);
        const comentarios_nombre = fields[`referencias[${index}][comentarios_nombre]`] || "";
        const estatus_logo = toNullable(fields[`referencias[${index}][estatus_logo]`]);
        const comentarios_logo = fields[`referencias[${index}][comentarios_logo]`] || "";

        const logosExistentes = Object.keys(fields)
          .filter(k => k.startsWith(`referencias[${index}][logoExistente]`))
          .map(k => fields[k]);

        let logoNuevo = null;
        Object.keys(files).forEach((key) => {
            if (key === `referencias[${index}][logo]`) {
                const file = files[key];
                if (Array.isArray(file)) {
                    logoNuevo = file[0]; // Solo el primero
                } else {
                    logoNuevo = file;
                }
            }
        });

        let rutaLogoFinal = logosExistentes?.[0] || null;

        if (logoNuevo) {
            const remotePath = `/uploads/ventas/imagenesPropuestas/${Date.now()}_${logoNuevo.name}`;
            try {
                await client.uploadFrom(logoNuevo.path, remotePath);
                rutaLogoFinal = remotePath;
                fs.unlinkSync(logoNuevo.path); // eliminar del tmp
            } catch (uploadErr) {
                console.error("Error subiendo archivo:", uploadErr);
            }
        }

        // Buscar o crear referencia para este índice
        let nombreProducto = await NombreProducto.findOne({
          where: { levantamiento_id: idLevantamiento, id },
        });

        const dataNombreProducto = {
          levantamiento_id: idLevantamiento,
          nombre,
          estatus_nombre,
          comentarios_nombre,
          logo: rutaLogoFinal,
          estatus_logo,
          comentarios_logo,
        };

        if (!nombreProducto) {
          await NombreProducto.create(dataNombreProducto);
        } else {
          await nombreProducto.update(dataNombreProducto);
        }

        referencias.push(dataNombreProducto);
      }

      client.close();

      return res.status(200).json({
        success: true,
        message: "Propuestas guardadas correctamente",
        referencias,
      });
    } catch (error) {
      console.error("Error en el servidor:", error);
      return res.status(500).json({ message: "Error en el servidor" });
    }
  });
}