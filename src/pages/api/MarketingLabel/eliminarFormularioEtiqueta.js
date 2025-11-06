import FormulariosEtiquetas from "@/models/FormulariosEtiquetas";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID es requerido" });
  }

  try {
    // Actualiza el estatus a 'Eliminado' usando Sequelize
    const [updated] = await FormulariosEtiquetas.update(
      { estatus: "Eliminado" },
      { where: { id } }
    );

    if (updated > 0) {
      return res.status(200).json({ message: "Formulario marcado como eliminado correctamente" });
    } else {
      return res.status(404).json({ message: "Formulario no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar el formulario:", error);
    return res.status(500).json({ message: "Error al eliminar el formulario" });
  }
}