import Usuario from "@/models/Usuarios"; // Modelo de Usuario

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: "ID requerido" });
  }

  try {
    // Buscar usuarios con el jefe_directo correspondiente
    const usuarios = await Usuario.findAll({
      where: { jefe_directo: id }
    });

    if (usuarios.length > 0) {
      return res.status(200).json({ success: true, users: usuarios });
    } else {
      return res.status(404).json({ success: false, message: "No se encontraron usuarios con este jefe directo" });
    }

  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    return res.status(500).json({ success: false, message: "Error en el servidor" });
  }
}