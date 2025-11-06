import { Client } from 'basic-ftp';

function getMimeType(fileName) {
  const ext = fileName.split('.').pop().toLowerCase();
  switch (ext) {
    case 'svg':
      return 'image/svg+xml';
    case 'pdf':
      return 'application/pdf';
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    default:
      return 'application/octet-stream';
  }
}

export default async function handler(req, res) {
  try {
    const { rutaImagen } = req.query;

    if (!rutaImagen) {
      return res.status(400).json({
        success: false,
        message: 'Parámetro "rutaImagen" es requerido.',
      });
    }

    if (rutaImagen.startsWith('/uploads/ventas/codigosBarras/')) {
      const client = new Client();

      try {
        await client.access({
          host: "50.6.199.166",
          user: "aionnet",
          password: "Rrio1003",
          secure: false,
        });

        const fileName = rutaImagen.split('/').pop();
        const mimeType = getMimeType(fileName);

        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);

        await client.downloadTo(res, rutaImagen);
        client.close();
      } catch (ftpError) {
        console.error('Error al descargar archivo desde el FTP:', ftpError);
        return res.status(500).json({
          success: false,
          message: 'Error al descargar el archivo desde el FTP.',
        });
      }
    } else {
      // Redirigir si es URL externa o ruta local
      return res.redirect(rutaImagen);
    }
  } catch (err) {
    console.error('Error general:', err);
    return res.status(500).json({
      success: false,
      message: 'Error al manejar la solicitud del archivo.',
    });
  }
}