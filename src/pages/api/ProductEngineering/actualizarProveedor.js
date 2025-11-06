import Proveedor from "@/models/Proveedores";
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

    const { id, nombre } = fields;

    const safeValues = {
      nombre: nombre || null,
    };

    await Proveedor.update(safeValues, {
      where: { id },
    });

    console.log("✅ Datos del proveedor actualizados correctamente.");

    res.status(200).json({ success: true, message: "Proveedor actualizado correctamente" });
  } catch (error) {
    console.error("Error actualizando el proveedor:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};