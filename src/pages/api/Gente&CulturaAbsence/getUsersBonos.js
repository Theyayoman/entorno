import Usuario from "@/models/Usuarios";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { departamento } = req.query;

  try {
    const whereClause = {
      eliminado: 0,
    };

    if (departamento) {
      whereClause.departamento_id = departamento;
    }

    const users = await Usuario.findAll({
      where: whereClause,
      order: [["nombre", "ASC"]],
    });

    if (users.length > 0) {
      return res.status(200).json({ success: true, users });
    } else {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    return res.status(500).json({ message: "Error al obtener los usuarios" });
  }
}