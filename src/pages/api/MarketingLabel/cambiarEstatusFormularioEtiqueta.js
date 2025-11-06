import FormulariosEtiquetas from "@/models/FormulariosEtiquetas";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { id, nuevoEstatus } = req.body;

  if (!id || !nuevoEstatus) {
    return res.status(400).json({ message: "ID y nuevoEstatus son requeridos" });
  }

  try {
    // Actualizamos el estatus en la base de datos
    const [updated] = await FormulariosEtiquetas.update(
      { estatus: nuevoEstatus },
      { where: { id } }
    );

    // Verificar si la actualización fue exitosa
    if (updated > 0) {
      res.status(200).json({ message: "Estatus actualizado correctamente" });
    } else {
      res.status(404).json({ message: "Formulario no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar el estatus:", error);
    res.status(500).json({ message: "Error al actualizar el estatus" });
  }
}