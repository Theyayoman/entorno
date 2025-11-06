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

    const { actor, tipo } = fields;

    if (!actor || !tipo) {
      return res.status(400).json({ message: "Los campos actor y tipo son obligatorios" });
    }

    const act = await Actor.create({
      user_id: actor,
      tipo: tipo,
    });

    if (!act) {
      return res.status(500).json({ message: "Error al guardar el actor" });
    }

    return res.status(201).json({ success: true, message: "Actor guardado correctamente" });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}