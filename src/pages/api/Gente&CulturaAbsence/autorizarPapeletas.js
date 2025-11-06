import { Op, literal } from "sequelize";
import FormulariosFaltas from "@/models/FormulariosFaltas";
import Usuario from "@/models/Usuarios";
import Departamento from "@/models/Departamentos";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { id } = req.query;

  try {
    // Realizamos la consulta con Sequelize
    const eventos = await FormulariosFaltas.findAll({
      where: {
        id_usuario: {
          [Op.ne]: id, // Equivalente a f.id_usuario != ?
        },
        eliminado: 0,
        estatus: "Pendiente",
        tipo: {
          [Op.notIn]: ["Aumento sueldo", "Horas extras", "Bonos / Comisiones", "Faltas", "Suspension"], // Excluyendo ciertos tipos
        },
      },
      attributes: [
        "id",
        "formulario",
        "fecha_inicio",
        "fecha_fin",
        "estatus",
        "archivo",
        "eliminado",
        "comentarios",
        "tipo",
        "extemporanea",
        "id_usuario",
        "fecha_subida",
        "fecha_actualizacion",
      ],
      include: [
        {
          model: Usuario,
          where: { jefe_directo: id }, // Equivalente a u.jefe_directo = ?
          attributes: ["id", "numero_empleado", "nombre", "apellidos", "puesto", "jefe_directo"],
          include: [
            {
              model: Departamento,
              attributes: [["nombre", "nombre_departamento"]],
            },
          ],
        },
      ],
      order: [["fecha_subida", "DESC"]], // Ordenamos por fecha_subida DESC
      raw: true, // Queremos obtener los datos sin instancias de Sequelize
    });

    // Procesamos los datos de la respuesta para ajustar los valores
    const result = eventos.map(evento => ({
      ...evento,
      numero_empleado: evento["Usuario.numero_empleado"] || null,
      nombre: evento["Usuario.nombre"] || null,
      apellidos: evento["Usuario.apellidos"] || null,
      puesto: evento["Usuario.puesto"] || null,
      jefe_directo: evento["Usuario.jefe_directo"] || null,
      id_papeleta: evento.id,
      nombre_departamento: evento["Usuario.Departamento.nombre_departamento"] || null,
      datos_formulario: typeof evento.formulario === "string" ? JSON.parse(evento.formulario) : evento.formulario, // Convertimos a objeto si es JSON
    }));

    // Enviamos la respuesta
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error al obtener los eventos:", error);
    return res.status(500).json({ message: "Error al obtener los eventos" });
  }
}
