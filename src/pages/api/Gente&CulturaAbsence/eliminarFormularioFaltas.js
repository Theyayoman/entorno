import FormulariosFaltas from "@/models/FormulariosFaltas"; // Asegúrate de que tu modelo de FormularioFalta esté bien configurado

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { id } = req.query;

    try {
      // Utiliza el método update para marcar como eliminado
      const [updated] = await FormulariosFaltas.update(
        { eliminado: 1 }, // Actualiza el campo eliminado a 1
        { where: { id } } // Aplica la condición al id del formulario
      );

      if (updated === 0) {
        return res.status(404).json({ message: "Formulario no encontrado" });
      }

      return res.status(200).json({ message: "Formulario eliminado correctamente" });
    } catch (error) {
      console.error("Error eliminando el formulario:", error);
      return res.status(500).json({ message: "Error al eliminar el formulario" });
    }
  } else {
    return res.status(405).json({ message: "Método no permitido" });
  }
}