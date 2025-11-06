import Usuario from "@/models/Usuarios";
import Departamento from "@/models/Departamentos";
import Permiso from "@/models/Permisos";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Método no permitido" });
  }

  const { correo, numero_empleado } = req.body;
  if (!correo && !numero_empleado) {
    return res.status(400).json({
      success: false,
      message: "El correo o el número de empleado es requerido",
    });
  }

  const field = correo ? "correo" : "numero_empleado";
  const value = correo || numero_empleado;

  try {
    // Buscar el usuario
    const user = await Usuario.findOne({ where: { [field]: value } });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    // Buscar el departamento
    const departamento = await Departamento.findByPk(user.departamento_id);
    if (!departamento) {
      return res
        .status(404)
        .json({ success: false, message: "Departamento no encontrado" });
    }

    // Buscar el permiso usando user.id_permiso
    let permisos = { campo: {}, seccion: "" };
    if (user.id_permiso) {
      const permisoRecord = await Permiso.findByPk(user.id_permiso, {
        attributes: ["seccion", "campo"],
      });

      if (permisoRecord) {
        try {
          permisos = {
            campo:
              typeof permisoRecord.campo === "string"
                ? JSON.parse(permisoRecord.campo)
                : permisoRecord.campo,
            seccion: permisoRecord.seccion,
          };
        } catch (error) {
          console.error("Error al parsear los permisos:", error);
        }
      }
    }

    // Respuesta final
    return res.status(200).json({
      success: true,
      user: {
        ...user.dataValues,
        permisos, // 👈 aquí ya están los permisos integrados
      },
      departamento,
    });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
}
