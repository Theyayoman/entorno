import Vacante from "@/models/Vacantes";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { id, estatus } = req.body;

  if (!id || !estatus) {
    return res.status(400).json({ message: "ID y estatus son requeridos" });
  }

  try {
    // Actualizar el campo `proceso_actual` con el nuevo estatus
    const [updatedRows] = await Vacante.update(
      { proceso_actual: estatus },
      { where: { id } }
    );

    if (updatedRows > 0) {
      return res.status(200).json({ message: "Vacante actualizada exitosamente" });
    } else {
      return res.status(404).json({ message: "Vacante no encontrada" });
    }
  } catch (err) {
    console.error("Error al actualizar la vacante:", err);
    return res.status(500).json({ message: "Error al actualizar la vacante" });
  }
}