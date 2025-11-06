import Prospecto from "@/models/Prospectos";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID de prospecto requerido" });
  }

  try {
    const prospecto = await Prospecto.findOne({
      where: { id },
      order: [["id", "ASC"]],
    });

    if (!prospecto) {
      return res.status(500).json({ error: "Error al obtener el prospecto" });
    }

    return res.status(200).json({ success: true, prospecto: prospecto });
  } catch (error) {
    console.error("Error al obtener el prospecto:", error);
    return res.status(500).json({ message: "Error al obtener el prospecto" });
  }
}