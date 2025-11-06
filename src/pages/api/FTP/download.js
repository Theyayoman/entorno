import { Client } from 'basic-ftp';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { filename } = req.query; // Nombre del archivo a descargar

        if (!filename) {
            return res.status(400).json({ error: 'Falta el nombre del archivo.' });
        }

        const client = new Client();
        client.ftp.verbose = true;

        try {
            // Conectar al servidor FTP
            await client.access({
                host: "192.168.1.87",
                user: "pruebas@nutriton.com.mx",
                password: "NutriAdmin2035",
                secure: false
            });

            // Directorio temporal en el que se descargará el archivo
            const localPath = path.join(process.cwd(), '/', filename);

            // Descargar el archivo desde el servidor FTP al directorio local temporal
            await client.downloadTo(localPath, `/${filename}`);

            // Leer el archivo descargado y devolverlo al cliente
            const fileContent = fs.readFileSync(localPath);
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            res.setHeader('Content-Type', 'application/octet-stream');
            res.send(fileContent);

            // Eliminar el archivo temporal después de haber sido enviado
            fs.unlinkSync(localPath);
        } catch (err) {
            console.error('Error descargando archivo: ', err);
            res.status(500).json({ error: 'Error al descargar archivo.' });
        } finally {
            client.close();
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}