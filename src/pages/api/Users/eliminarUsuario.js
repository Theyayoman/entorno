import Usuario from "@/models/Usuarios"; // Modelo de Usuario

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID de usuario requerido" });
  }

  try {
    // Buscar el usuario por ID
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    // Actualizar el campo `eliminado`
    await usuario.update({ eliminado: 1 });

    return res.status(200).json({ success: true, message: "Usuario marcado como eliminado correctamente" });

  } catch (error) {
    console.error("Error marcando el usuario como eliminado:", error);
    return res.status(500).json({ success: false, message: "Error en el servidor" });
  }
}