import RegistroEventos from "@/models/RegistroEventos";
import Notificacion from "@/models/Notificacion";
import sequelize from "@/lib/sequelize";

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

      // Crear las notificaciones para esos usuarios
      const notificaciones = formData2.actores.map((actor) => ({
        id_evento: nuevoEvento.id,
        id_usuario: actor.user_id,
      }));

      if (notificaciones.length > 0) {
        await Notificacion.bulkCreate(notificaciones, { transaction });
      }

      // Confirmar transacción
      await transaction.commit();

      res.status(201).json({ message: "Evento guardado correctamente" });
    } catch (error) {
      await transaction.rollback(); // Revertir cambios en caso de error
      throw error;
    }
  } catch (error) {
    console.error("Error guardando el evento:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
}