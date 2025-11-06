import FormulariosEstrategias from "@/models/FormulariosEstrategias"; // Modelo de FormulariosEstrategias

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID es requerido" });
  }

  try {
    // Ejecutar el update para marcar el formulario como eliminado
    const [affectedRows] = await FormulariosEstrategias.update(
      { eliminado: 1 }, // Establecer el campo 'eliminado' a 1
      {
        where: { id }, // Condición para encontrar el formulario por ID
      }
    );

    if (affectedRows > 0) {
      return res.status(200).json({ message: "Formulario eliminado correctamente" });
    } else {
      return res.status(404).json({ message: "Formulario no encontrado" });
    }
  } catch (error) {
    console.error("Error eliminando el formulario:", error);
    return res.status(500).json({ message: "Error al eliminar el formulario" });
  }
}