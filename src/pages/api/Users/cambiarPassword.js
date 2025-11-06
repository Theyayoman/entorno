import Usuario from "@/models/Usuarios"; // Modelo de Usuario
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { userId, nuevaContraseña } = req.body;

  if (!userId || !nuevaContraseña) {
    return res.status(400).json({ message: "Faltan datos requeridos" });
  }

  try {
    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);

    // Buscar el usuario por ID
    const usuario = await Usuario.findByPk(userId);

    if (!usuario) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    // Actualizar la contraseña
    await usuario.update({ password: hashedPassword });

    return res.status(200).json({ success: true, message: "Contraseña actualizada correctamente" });

  } catch (error) {
    console.error("Error actualizando la contraseña:", error);
    return res.status(500).json({ success: false, message: "Error en el servidor" });
  }
}