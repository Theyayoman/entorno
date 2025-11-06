import Usuario from "@/models/Usuarios"; // Modelo de Usuario
import Permiso from "@/models/Permisos";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const {
    id,
    nombre,
    apellidos,
    correo,
    numero_empleado,
    puesto,
    departamento_id,
    rol,
    telefono,
    fecha_ingreso,
    jefe_directo,
    empresa_id,
    planta,
    plataformas,
  } = req.body;

  try {
    // Buscar el usuario por ID
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    // Actualizar el usuario con los nuevos valores
    await usuario.update({
      nombre,
      apellidos,
      correo,
      numero_empleado,
      puesto,
      departamento_id,
      rol,
      telefono,
      fecha_ingreso,
      jefe_directo: jefe_directo || null,
      empresa_id,
      planta,
      plataformas,
    });

    if (rol === "Dado de baja") {
      const permiso = await Permiso.findOne({ where: { id: usuario.id_permiso } });
      if (permiso) {
        await usuario.update({ id_permiso: null });
        await permiso.destroy();
      }
    }

    return res.status(200).json({ success: true, message: "Usuario actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    return res.status(500).json({ success: false, message: "Error al actualizar el usuario" });
  }
}