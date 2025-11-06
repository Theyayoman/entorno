import Empresa from "@/models/Empresas"; // Modelo de Empresa

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { id } = req.query;

    try {
      // Buscar la empresa por ID
      const empresa = await Empresa.findByPk(id);

      if (!empresa) {
        return res.status(404).json({ success: false, message: "Formulario no encontrado" });
      }

      // Actualizar la columna 'eliminado' en lugar de eliminar el registro
      await empresa.update({
        eliminado: 1, // Marca la empresa como eliminada
      });

      return res.status(200).json({ success: true, message: "Formulario marcado como eliminado correctamente" });

    } catch (error) {
      console.error("Error eliminando el formulario:", error);
      return res.status(500).json({ success: false, message: "Error al eliminar el formulario" });
    }
  } else {
    return res.status(405).json({ message: "Método no permitido" });
  }
}