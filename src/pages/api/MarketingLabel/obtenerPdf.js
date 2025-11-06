import { Client } from 'basic-ftp';
import db from '@/lib/db'; // Asegúrate de que tu conexión a la base de datos esté correctamente configurada

export default async function handler(req, res) {
  try {
    const { pdf } = req.query;

    if (!pdf) {
      return res.status(400).json({
        success: false,
        message: 'Parámetro "pdf" es requerido.',
      });
    }

    // Si el archivo comienza con "/uploads", procesarlo desde el servidor FTP
    if (pdf.startsWith('/uploads')) {
      const client = new Client();

      try {
        await client.access({
          host: "50.6.199.166",  // Dirección del servidor FTP
          user: "aionnet",         // Usuario FTP
          password: "Rrio1003", // Contraseña FTP
          secure: false,
        });

        // Configurar encabezados para la respuesta
        const fileName = pdf.split('/').pop(); // Obtiene el nombre completo del archivo

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);

        // Descargar archivo desde el servidor FTP directamente al cliente
        await client.downloadTo(res, pdf);
        client.close();
      } catch (ftpError) {
        console.error('Error al descargar archivo desde el FTP:', ftpError);
        return res.status(500).json({
          success: false,
          message: 'Error al descargar el archivo desde el FTP.',
        });
      }
    } else {
      // Si el archivo no comienza con "/uploads", asumir que es una URL Blob

      // Extraer el nombre del archivo desde la URL
      const fileName = pdf.split('/').pop(); // Obtiene el nombre completo del archivo
      const baseName = fileName.split('-')[0]; // Obtiene la parte antes del guion

      // Configurar encabezados para la redirección
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${baseName}.pdf"`);

      // Redirigir al cliente a la URL pública del archivo
      return res.redirect(pdf);
    }
  } catch (err) {
    console.error('Error al manejar la solicitud del archivo PDF:', err);
    return res.status(500).json({
      success: false,
      message: 'Error al manejar la solicitud del archivo PDF.',
    });
  }
}
