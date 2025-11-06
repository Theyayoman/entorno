import Prototipo from "@/models/Prototipos";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const prototipo = req.body;
  try {
    const result = await Prototipo.create(prototipo);
    res
      .status(200)
      .json({
        success: true,
        message: "Prototipo guardado correctamente",
        prototipo: result,
      });
  } catch (error) {
    console.error("Error al guardar el prototipo:", error);
    res.status(500).json({ error: "Error al guardar el prototipo" });
  }
}
