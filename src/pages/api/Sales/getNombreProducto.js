import NombreProducto from "@/models/NombreProducto";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID de propuestas requerido" });
  }

  try {
    const referencias = await NombreProducto.findAll({
        where: { levantamiento_id: id },
        order: [['id', 'DESC']],
        limit: 3
    });

    referencias.reverse();

    return res.status(200).json({ success: true, referencias: referencias || null });
  } catch (error) {
    console.error("Error al obtener las propuestas:", error);
    return res.status(500).json({ message: "Error al obtener las propuestas" });
  }
}