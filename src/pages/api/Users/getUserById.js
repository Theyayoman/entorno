import Usuario from "@/models/Usuarios"; // Importar el modelo de usuario

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Método no permitido" });
  }

  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ success: false, message: "El ID es requerido" });
  }

  try {
    // Buscar el usuario por ID
    const usuario = await Usuario.findOne({ where: { id } });

    if (!usuario) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    return res.status(200).json({ success: true, user: usuario });

  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
}