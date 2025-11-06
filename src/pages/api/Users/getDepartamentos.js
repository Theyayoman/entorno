import Departamento from "@/models/Departamentos";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Método no permitido" });
  }

  try {
    // Consultar usuarios con sus departamentos y empresas asociadas
    const departamentos = await Departamento.findAll({
      order: [["id", "ASC"]],
      raw: true,
    });

    if (departamentos.length > 0) {
      return res.status(200).json({ success: true, departments: departamentos });
    } else {
      return res.status(404).json({ success: false, message: "No hay departamentos" });
    }
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
}