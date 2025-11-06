import Prospecto from "@/models/Prospectos";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const prospectos = await Prospecto.findAll({
      order: [["id", "ASC"]],
    });

    if (!prospectos) {
      return res.status(500).json({ error: "Error al obtener los prospectos" });
    }

    return res.status(200).json({ success: true, prospectos: prospectos });
  } catch (error) {
    console.error("Error al obtener los prospectos:", error);
    return res.status(500).json({ message: "Error al obtener los prospectos" });
  }
}