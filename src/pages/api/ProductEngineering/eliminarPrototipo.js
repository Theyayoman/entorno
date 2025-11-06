import Prototipo from "@/models/Prototipos";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { id } = req.body;
  try {
    await Prototipo.destroy({ where: { id } });
    res.status(200).json({ success: true, message: "Prototipo eliminado" });
  } catch (error) {
    console.error("Error al eliminar el prototipo:", error);
    res.status(500).json({ error: "Error al eliminar el prototipo " + error });
  }
}
