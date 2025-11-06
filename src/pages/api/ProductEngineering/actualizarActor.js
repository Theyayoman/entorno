import Actor from "@/models/Actores";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;

    const fields = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields) => {
        if (err) reject(err);
        else resolve(fields);
      });
    });

    const { id, actor, tipo } = fields;

    const safeValues = {
      user_id: actor || null,
      tipo: tipo || null,
    };

    await Actor.update(safeValues, {
      where: { id },
    });

    console.log("✅ Datos del actor actualizados correctamente.");

    res.status(200).json({ success: true, message: "Actor actualizado correctamente" });
  } catch (error) {
    console.error("Error actualizando el actor:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};