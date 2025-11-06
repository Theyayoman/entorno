import FormulariosEstrategias from '@/models/FormulariosEstrategias'; // Asegúrate de importar el modelo de Sequelize

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID es requerido' });
  }

  try {
    // Buscar el formulario por ID usando Sequelize
    const formulario = await FormulariosEstrategias.findOne({
      where: { id },
      attributes: ['formulario'] // Solo obtenemos la columna 'formulario'
    });

    if (!formulario) {
      return res.status(404).json({ message: 'Formulario no encontrado' });
    }

    let datos = formulario.formulario;

    // Intentar parsear el formulario si es un string JSON
    try {
      datos = JSON.parse(datos);
    } catch (error) {
      // Si no es un JSON válido, devolvemos el valor tal cual
      datos = formulario.formulario; // Mantener el valor original si no es JSON
    }

    res.status(200).json(datos);
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    res.status(500).json({ message: 'Error al obtener los datos' });
  }
}