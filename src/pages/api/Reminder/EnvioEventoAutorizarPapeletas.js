import RegistroEventos from "@/models/RegistroEventos";
import Notificacion from "@/models/Notificacion";
import Usuario from "@/models/Usuarios";
import FormulariosFaltas from "@/models/FormulariosFaltas";
import sequelize from "@/lib/sequelize"; // Instancia de Sequelize

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

      const papeleta = await FormulariosFaltas.findOne({
        where: { id: formData2.idPapeleta },
        attributes: ['id', 'id_usuario'],
      });
      
      if (!papeleta) {
        throw new Error("No se encontró la papeleta con el ID proporcionado.");
      }
      
      const usuarios = await Usuario.findAll({
        where: { id: papeleta.id_usuario },
        attributes: ["id"],
      });
      
      // Crear las notificaciones para esos usuarios
      const notificaciones = usuarios.map(usuario => ({
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