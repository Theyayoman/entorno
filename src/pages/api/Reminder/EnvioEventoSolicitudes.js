import RegistroEventos from "@/models/RegistroEventos";
import Notificacion from "@/models/Notificacion";
import Usuario from "@/models/Usuarios";
import Permiso from "@/models/Permisos";
import sequelize from "@/lib/sequelize"; // Instancia de Sequelize
import { Op } from "sequelize"; // Operadores de Sequelize

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { formData2 } = req.body;

  try {
    // Iniciar transacción
    const transaction = await sequelize.transaction();

    try {
      // Insertar el registro del evento
      const nuevoEvento = await RegistroEventos.create(
        {
          tipo: formData2.tipo,
          descripcion: formData2.descripcion,
          id_usuario: formData2.id,
          id_departamento: formData2.dpto,
        },
        { transaction }
      );

      // Buscar permisos en ambos formatos (JSON y TEXT)
      const permisos = await Permiso.findAll({
        where: {
          [Op.or]: [
            // Si el campo es JSON en MySQL, usamos JSON_SEARCH
            sequelize.literal(`JSON_SEARCH(campo, 'one', 'Modulo papeletas', NULL, '$.Papeletas') IS NOT NULL`),
            // Si el campo es TEXT, usamos LIKE
            { campo: { [Op.like]: '%"Papeletas":["Modulo papeletas"]%' } },
          ],
        },
        attributes: ["id"],
      });

      const permisosIds = permisos.map((permiso) => permiso.id);

      // Obtener usuarios con los permisos filtrados
      const usuarios = await Usuario.findAll({
        where: {
          id_permiso: {
            [Op.in]: permisosIds,
          },
        },
        attributes: ["id"],
      });

      // Crear las notificaciones para esos usuarios
      const notificaciones = usuarios.map((usuario) => ({
        id_evento: nuevoEvento.id,
        id_usuario: usuario.id,
      }));

      if (notificaciones.length > 0) {
        await Notificacion.bulkCreate(notificaciones, { transaction });
      }

      // Confirmar transacción
      await transaction.commit();

      res.status(201).json({ message: "Evento guardado correctamente" });
    } catch (error) {
      await transaction.rollback(); // Revertir cambios en caso de error
      console.error("Error en la transacción:", error);
      res.status(500).json({ message: "Error en el servidor", error });
    }
  } catch (error) {
    console.error("Error general:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
}