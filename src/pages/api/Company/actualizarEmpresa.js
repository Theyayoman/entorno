import Empresa from "@/models/Empresas"; // Modelo de Empresa

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { id, formulario } = req.body;

  try {
    // Buscar la empresa por ID
    const empresa = await Empresa.findByPk(id);

    if (!empresa) {
      return res.status(404).json({ success: false, message: "Empresa no encontrada" });
    }

    // Actualizar la empresa con el nuevo formulario
    await empresa.update({
      formulario: JSON.stringify(formulario), // Convertir a JSON si es necesario
    });

    return res.status(200).json({ success: true, message: "Empresa actualizada exitosamente" });

  } catch (error) {
    console.error("Error al actualizar la empresa:", error);
    return res.status(500).json({ success: false, message: "Error al actualizar la empresa" });
  }
}