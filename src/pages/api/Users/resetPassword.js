import Usuario from '@/models/Usuarios';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const { selectedUsers, resetPass } = req.body;

    if (!selectedUsers || selectedUsers.length === 0) {
      return res.status(400).json({ message: "No se seleccionaron usuarios" });
    }

    if (!resetPass || resetPass.trim() === "") {
      return res.status(400).json({ message: "La nueva contraseña es requerida" });
    }

    // Extraer solo los IDs de los usuarios seleccionados
    const userIds = selectedUsers.map(user => user.id);

    // Verificar que los IDs sean correctos
    console.log("IDs a actualizar:", userIds);

    if (userIds.length === 0) {
      return res.status(400).json({ message: "No se encontraron IDs de usuarios válidos" });
    }

    // Hashear la nueva contraseña antes de almacenarla
    const hashedPassword = await bcrypt.hash(resetPass, 10);

    // Actualizar la contraseña en la base de datos
    const [updatedRows] = await Usuario.update(
      { password: hashedPassword },
      { where: { id: { [Op.in]: userIds } } } // Usamos Op.in con los IDs correctos
    );

    if (updatedRows === 0) {
      return res.status(400).json({ message: "No se encontraron usuarios para actualizar" });
    }

    return res.status(200).json({ message: `Contraseñas actualizadas correctamente para ${updatedRows} usuario(s).` });

  } catch (error) {
    console.error("Error al resetear contraseñas:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}