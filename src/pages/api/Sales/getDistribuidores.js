import Distribuidor from "@/models/Distribuidores";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID de distribuidores requerido" });
  }

  try {
    const distribuidores = await Distribuidor.findOne({ where: { levantamiento_id: id } });

    return res.status(200).json({
      success: true,
      distribuidores: distribuidores || null,
    });
  } catch (error) {
    console.error("Error al obtener los distribuidores:", error);
    return res.status(500).json({ message: "Error al obtener los distribuidores" });
  }
}