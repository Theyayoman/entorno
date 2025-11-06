import bcrypt from "bcrypt";
import Usuario from "@/models/Usuarios"; // Modelo de Usuario

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Método no permitido" });
  }

  const { nombre, apellidos, correo, password } = req.body;

  try {
    // Buscar el usuario por su correo
    const usuario = await Usuario.findOne({ where: { correo } });

    if (!usuario) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    // Si la contraseña no es proporcionada, solo actualiza los datos básicos
    if (!password) {
      await usuario.update({ nombre, apellidos });
    } else {
      // Encriptar la nueva contraseña antes de actualizar
      const hashedPassword = await bcrypt.hash(password, 10);
      await usuario.update({ nombre, apellidos, password: hashedPassword });
    }

    return res.status(200).json({ success: true, message: "Usuario actualizado correctamente" });

  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
}