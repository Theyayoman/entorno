import { literal } from "sequelize";
import FormulariosEtiquetas from "@/models/FormulariosEtiquetas";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    // Consulta para obtener los eventos usando Sequelize
    const rows = await FormulariosEtiquetas.findAll({
      where: { eliminado: false },
      order: [['fecha_actualizacion', 'DESC']],
      attributes: [
        'id', 
        'datos_formulario', 
        'pdf_path', 
        'eliminado', 
        'estatus',
        'fecha_envio',
        'fecha_actualizacion',
        'firmas'
      ]
    });

    // Convertir datos_formulario y firmas a JSON si es necesario
    const parsedRows = rows.map(row => ({
      ...row.dataValues,
      datos_formulario: parseJSON(row.datos_formulario),
      firmas: parseJSON(row.firmas),
    }));

    // Retorna los eventos en formato JSON
    res.status(200).json(parsedRows);
  } catch (error) {
    console.error('Error al obtener los eventos:', error);
    res.status(500).json({ message: 'Error al obtener los eventos' });
  }
}

// Función para intentar parsear JSON, si falla devuelve el valor original
function parseJSON(value) {
  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch (error) {
    console.error('Error al parsear JSON:', value, error);
    return value; // Devuelve el valor original si hay un error
  }
}