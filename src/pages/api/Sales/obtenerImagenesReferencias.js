import { Client } from 'basic-ftp';

export default async function handler(req, res) {
  try {
    const { rutaImagen } = req.query;

    if (!rutaImagen) {
      return res.status(400).json({
        success: false,
        message: 'Parámetro "rutaImagen" es requerido.',
      });
    }

    // Si el archivo está en el servidor FTP
    if (rutaImagen.startsWith('/uploads/ventas/imagenesReferencias/')) {
      const client = new Client();

      try {
        await client.access({
          host: "50.6.199.166",
          user: "aionnet",
          password: "Rrio1003",
          secure: false,
        });

        const fileName = rutaImagen.split('/').pop();

        res.setHeader('Content-Type', 'image/jpeg'); // O cambia a 'image/png' si es PNG
        res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);

        // Descargar el PDF directamente al cliente
        await client.downloadTo(res, rutaImagen);
        client.close();
      } catch (ftpError) {
        console.error('Error al descargar la imagen desde el FTP:', ftpError);
        return res.status(500).json({
          success: false,
          message: 'Error al descargar la imagen desde el FTP.',
        });
      }
    } else {
      // Si es una URL externa o local, redirigir
      return res.redirect(rutaImagen);
    }
  } catch (err) {
    console.error('Error al manejar la solicitud de la imagen:', err);
    return res.status(500).json({
      success: false,
      message: 'Error al manejar la solicitud de la imagen.',
    });
  }
}