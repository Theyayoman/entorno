import formidable from 'formidable';
import path from 'path';
import FormulariosEtiquetas from '@/models/FormulariosEtiquetas';

export const config = {
  api: {
    bodyParser: false, // Deshabilitar bodyParser para que formidable maneje el form-data
  },
};

export default async function guardarFormulario(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(process.cwd(), '/uploads');
    form.keepExtensions = true;

    try {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Error en el formulario:', err);
          return res.status(500).json({ success: false, message: 'Error al procesar el formulario' });
        }

        const filePath = files.pdf[0].filepath; // Cambia esto según cómo quieras manejar los archivos
        const datosFormulario = fields.datos_formulario; // Los datos del formulario
        const id = fields.id;

        try {
          // Usando Sequelize para hacer la actualización
          const result = await FormulariosEtiquetas.update(
            {
              datos_formulario: datosFormulario, // Datos del formulario
              pdf_path: filePath, // Ruta del archivo
            },
            {
              where: {
                id: id, // Buscar por el ID que recibimos
              },
            }
          );

          if (result[0] > 0) {
            // Si hay filas afectadas, el formulario se guardó correctamente
            res.status(200).json({ success: true, message: 'Formulario guardado correctamente' });
          } else {
            // Si no se encuentra el formulario
            res.status(404).json({ success: false, message: 'Formulario no encontrado' });
          }
        } catch (error) {
          console.error('Error al guardar en la base de datos:', error);
          return res.status(500).json({ success: false, message: 'Error al guardar en la base de datos' });
        }
      });
    } catch (error) {
      console.error('Error en el proceso de guardado:', error);
      return res.status(500).json({ success: false, message: 'Error en el proceso de guardado' });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}