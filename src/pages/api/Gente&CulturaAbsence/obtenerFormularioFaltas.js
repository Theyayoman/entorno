import FormulariosFaltas from "@/models/FormulariosFaltas";
import { literal } from "sequelize";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID es requerido' });
  }

  try {
    // Obtener el formulario por ID con la conversión de zona horaria utilizando sequelize.literal
    const formulario = await FormulariosFaltas.findOne({
      attributes: [
        'id',
        'formulario_id',
        'formulario',
        'id_usuario',
        'fecha_inicio',
        'fecha_fin',
        'estatus',
        'archivo',
        'eliminado',
        'tipo',
        'comentarios',
        'extemporanea'
      ],
      where: { id },
    });

    // Verificar si se encontró el formulario
    if (!formulario) {
      return res.status(404).json({ message: 'Formulario no encontrado' });
    }

    let formularioData;
    try {
      // Intentar parsear como JSON
      formularioData = formulario.formulario ? JSON.parse(formulario.formulario) : null;
    } catch (error) {
      // Si falla, se trata como texto
      formularioData = formulario.formulario;
    }

    const evento = {
      ...formulario.toJSON(),
      formulario: formularioData,
    };

    res.status(200).json(evento);
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    res.status(500).json({ message: 'Error al obtener los datos' });
  }
}