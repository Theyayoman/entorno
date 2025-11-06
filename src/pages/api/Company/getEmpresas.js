import Empresa from "@/models/Empresas"; // Modelo de Empresa

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Método no permitido" });
  }

  try {
    // Obtener todas las empresas donde 'eliminado' es 0
    const empresas = await Empresa.findAll({
      where: { eliminado: 0 },
    });

    if (empresas.length === 0) {
      return res.status(404).json({ success: false, message: "Empresas no encontradas" });
    }

    // Intentar parsear cada columna que pueda ser JSON
    const parsedEmpresas = empresas.map((empresa) => {
      return Object.fromEntries(
        Object.entries(empresa.toJSON()).map(([key, value]) => {
          try {
            return [key, JSON.parse(value)];
          } catch (error) {
            return [key, value]; // Si falla, mantener el valor original
          }
        })
      );
    });

    return res.status(200).json({ success: true, users: parsedEmpresas });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
}