const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3000;

// Dirección IP y puerto del servidor remoto
const remoteServerUrl = 'http://192.168.1.87:445'; // Cambia a la IP y puerto reales

// Credenciales
const username = 'Administrador';
const password = 'NutriAdmin2035';

// Ruta estática para servir archivos del explorador
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para obtener la lista de archivos del servidor remoto
app.get('/files', async (req, res) => {
    try {
        const response = await axios.get(`${remoteServerUrl}'/C:/Shares/SISTEMAS`, {
            auth: {
                username: username,
                password: password
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error al obtener archivos del servidor remoto');
    }
});

// Ruta para descargar un archivo desde el servidor remoto
app.get('/download', async (req, res) => {
    try {
        const fileName = req.query.name;
        const response = await axios.get(`${remoteServerUrl}/download`, {
            params: { name: fileName },
            responseType: 'stream',
            auth: {
                username: username,
                password: password
            }
        });

        response.data.pipe(res);
    } catch (error) {
        res.status(500).send('Error al descargar el archivo desde el servidor remoto');
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
