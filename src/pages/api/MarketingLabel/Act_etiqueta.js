import FormulariosEtiquetas from "@/models/FormulariosEtiquetas";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID es requerido" });
  }

  const formData = req.body;

  if (!formData) {
    return res.status(400).json({ message: "Datos del formulario son requeridos" });
  }

  try {
    const { estatus, firmas } = formData;

    // Actualizar el formulario en la base de datos
    const [updated] = await FormulariosEtiquetas.update(
      {
        datos_formulario: JSON.stringify(formData),
        estatus,
        firmas,
        fecha_actualizacion: new Date(),
      },
      {
        where: { id },
      }
    );

    // Verificar si la actualización fue exitosa
    if (updated > 0) {
      res.status(200).json({ message: "Formulario guardado correctamente" });
    } else {
      res.status(404).json({ message: "Formulario no encontrado" });
    }
  } catch (error) {
    console.error("Error guardando el formulario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
}