import Vacante from "@/models/Vacantes";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID es requerido" });
  }

  try {
    // Buscar la vacante por ID
    const vacante = await Vacante.findOne({ where: { id } });

    if (!vacante) {
      return res.status(404).json({ message: "Vacante no encontrada" });
    }

    res.status(200).json(vacante);
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    res.status(500).json({ message: "Error al obtener los datos" });
  }
}