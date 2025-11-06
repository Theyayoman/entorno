import fs from "fs";
import { Client } from "basic-ftp";
import path from "path";
import formidable from "formidable";
import Referencia from "@/models/Referencias";

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

      await client.ensureDir("/uploads/ventas/imagenesReferencias");

      const referenciasEnBD = await Referencia.findAll({
        where: { levantamiento_id: idLevantamiento },
      });
        
      const idsEnFormulario = indices
        .map(index => fields[`referencias[${index}][id]`])
        .filter(Boolean);
        
      // Eliminar las referencias que no están en el formulario
      for (const ref of referenciasEnBD) {
          if (!idsEnFormulario.includes(ref.id.toString())) {
          await ref.destroy();
        }
      }  

      for (const index of indices) {
        const id = fields[`referencias[${index}][id]`] || "";
        const nombre = fields[`referencias[${index}][nombre]`] || "";
        const link = fields[`referencias[${index}][link]`] || "";
        const notas = fields[`referencias[${index}][notas]`] || "";
        const tipo = fields[`referencias[${index}][tipo]`] || "";

        const imagenesExistentes = Object.keys(fields)
          .filter(k => k.startsWith(`referencias[${index}][imagenesExistentes]`))
          .map(k => fields[k]);

        const imagenesNuevas = [];
        Object.keys(files).forEach((key) => {
          if (key.startsWith(`referencias[${index}][imagenes]`)) {
            const file = files[key];
            if (Array.isArray(file)) {
              imagenesNuevas.push(...file);
            } else if (file) {
              imagenesNuevas.push(file);
            }
          }
        });

        const rutasFinales = [...imagenesExistentes];

        for (const file of imagenesNuevas) {
          if (rutasFinales.length >= 4) break;

          const remotePath = `/uploads/ventas/imagenesReferencias/${Date.now()}_${file.name}`;
          try {
            await client.uploadFrom(file.path, remotePath);
            rutasFinales.push(remotePath);
            fs.unlinkSync(file.path); // borra del tmp
          } catch (uploadErr) {
            console.error("Error subiendo archivo:", uploadErr);
          }
        }

        // Buscar o crear referencia para este índice
        let referencia = await Referencia.findOne({
          where: { levantamiento_id: idLevantamiento, id },
        });

        const dataReferencia = {
          levantamiento_id: idLevantamiento,
          nombre,
          link,
          notas,
          tipo,
          img1: rutasFinales[0] || null,
          img2: rutasFinales[1] || null,
          img3: rutasFinales[2] || null,
          img4: rutasFinales[3] || null,
        };

        if (!referencia) {
          await Referencia.create(dataReferencia);
        } else {
          await referencia.update(dataReferencia);
        }

        referencias.push(dataReferencia);
      }

      client.close();

      return res.status(200).json({
        success: true,
        message: "Referencias guardadas correctamente",
        referencias,
      });
    } catch (error) {
      console.error("Error en el servidor:", error);
      return res.status(500).json({ message: "Error en el servidor" });
    }
  });
}