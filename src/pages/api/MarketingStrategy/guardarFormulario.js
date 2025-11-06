import FormulariosEstrategias from '@/models/FormulariosEstrategias'; // Asegúrate de que tienes el modelo Sequelize adecuado

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { formData } = req.body;

  if (!formData) {
    return res.status(400).json({ message: 'Datos del formulario son requeridos' });
  }

  console.log(formData);

  try {
    // Guardar el formulario en la base de datos usando Sequelize
    await FormulariosEstrategias.create({
      formulario: JSON.stringify(formData), // Guardar el formulario como un string JSON
    });

    res.status(201).json({ message: 'Formulario guardado correctamente' });
  } catch (error) {
    console.error('Error guardando el formulario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}