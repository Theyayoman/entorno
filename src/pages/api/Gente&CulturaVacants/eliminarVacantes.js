import Vacante from "@/models/Vacantes";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID es requerido" });
  }

  try {
    // Actualizar el campo `eliminado` a 1 para la vacante con el ID proporcionado
    const [updatedRows] = await Vacante.update(
      { eliminado: 1 },
      { where: { id } }
    );

    if (updatedRows > 0) {
      return res.status(200).json({ message: "Formulario eliminado correctamente" });
    } else {
      return res.status(404).json({ message: "Formulario no encontrado" });
    }
  } catch (error) {
    console.error("Error eliminando el formulario:", error);
    return res.status(500).json({ message: "Error al eliminar el formulario" });
  }
}