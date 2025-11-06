import FormulariosEstrategias from "@/models/FormulariosEstrategias"; // Modelo de FormularioEstrategia

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID es requerido' });
  }

  const { formData } = req.body;
  console.log(formData);

  try {
    // Buscar el formulario por ID
    const formulario = await FormulariosEstrategias.findByPk(id);

    if (!formulario) {
      return res.status(404).json({ message: 'Formulario no encontrado' });
    }

    // Convertir formData a JSON string
    const formDataString = JSON.stringify(formData);

    // Actualizar el formulario con los nuevos valores
    await formulario.update({
      formulario: formDataString, // Usamos JSON.stringify en formData
      fecha_actualizacion: new Date(), // Establecer la fecha de actualización a la fecha actual
    });

    return res.status(200).json({ message: 'Formulario guardado correctamente' });

  } catch (error) {
    console.error('Error guardando el formulario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}