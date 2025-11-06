import { Client } from 'basic-ftp';

export default async function handler(req, res) {
  try {
    const { rutaDocumento } = req.query;

    if (!rutaDocumento) {
      return res.status(400).json({
        success: false,
        message: 'Parámetro "rutaDocumento" es requerido.',
      });
    }

    // Si el archivo está en el servidor FTP
    if (rutaDocumento.startsWith('/uploads/ventas/prospectos/constancias/')) {
      const client = new Client();

      try {
        await client.access({
          host: "50.6.199.166",
          user: "aionnet",
          password: "Rrio1003",
          secure: false,
        });

        const fileName = rutaDocumento.split('/').pop();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);

        // Descargar el PDF directamente al cliente
        await client.downloadTo(res, rutaDocumento);
        client.close();
      } catch (ftpError) {
        console.error('Error al descargar PDF desde el FTP:', ftpError);
        return res.status(500).json({
          success: false,
          message: 'Error al descargar el PDF desde el FTP.',
        });
      }
    } else {
      // Si es una URL externa o local, redirigir
      return res.redirect(rutaDocumento);
    }
  } catch (err) {
    console.error('Error al manejar la solicitud del PDF:', err);
    return res.status(500).json({
      success: false,
      message: 'Error al manejar la solicitud del PDF.',
    });
  }
}