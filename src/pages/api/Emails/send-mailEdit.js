// pages/api/sendEmail.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { recipientEmail, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
      host: 'mail.aionnet.net', // Servidor SMTP de tu dominio
      port: 465, // O 587 si estás utilizando TLS
      secure: true, // Usar true para puerto 465, false para otros puertos
      auth: {
        user: 'etiquetas@aionnet.net', // Tu correo completo
        pass: '!SD[ftw.ZOR4', // La contraseña de tu cuenta de correo
      },
    });

    try {
      await transporter.sendMail({
        from: 'etiquetas@aionnet.net',
        to: recipientEmail,
        subject: subject,
        text: message,
      });

      res.status(200).json({ message: 'Correo enviado exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al enviar el correo' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}