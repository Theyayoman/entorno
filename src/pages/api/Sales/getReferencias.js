import Referencia from "@/models/Referencias";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID de referencias requerido" });
  }

  try {
    const referencias = await Referencia.findAll({ where: { levantamiento_id: id } });

    if (!referencias) {
      return res.status(500).json({ error: "Error al obtener las referencias" });
    }

    return res.status(200).json({ success: true, referencias: referencias });
  } catch (error) {
    console.error("Error al obtener las referencias:", error);
    return res.status(500).json({ message: "Error al obtener las referencias" });
  }
}