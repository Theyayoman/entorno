const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

// Crea el cliente OAuth2
const createOAuth2Client = () => {
  return new OAuth2(
    process.env.CLIENT_ID, // ID del Cliente desde Google Cloud
    process.env.CLIENT_SECRET, // Secreto del Cliente
    process.env.REDIRECT_URI // URI de redirección configurada en Google
  );
};

// Generar URL de autenticación para obtener el token
const getAuthUrl = (oAuth2Client) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.send'],
  });
  return authUrl;
};

// Autenticar usando el código de autorización para obtener el token
const getAccessToken = async (code) => {
  const oAuth2Client = createOAuth2Client();
  const { tokens } = await oAuth2Client.getToken(code); // Obtener el token con el código
  oAuth2Client.setCredentials(tokens);
  return oAuth2Client;
};

// Enviar correo electrónico utilizando la API de Gmail
const sendMail = async (oAuth2Client, to, subject, message) => {
  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
  const rawMessage = createEmail(to, subject, message);

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: rawMessage,
    },
  });
};

// Crear el mensaje en formato base64
const createEmail = (to, subject, message) => {
  const str = [
    `To: ${to}`,
    'Content-Type: text/html; charset=UTF-8',
    'MIME-Version: 1.0',
    `Subject: ${subject}`,
    '',
    message,
  ].join('\n');

  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

module.exports = { getAuthUrl, getAccessToken, sendMail };