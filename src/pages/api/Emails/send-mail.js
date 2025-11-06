import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { emails, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
      host: 'mail.aionnet.net',
      port: 465,
      secure: true,
      auth: {
        user: 'etiquetas@aionnet.net',
        pass: '!SD[ftw.ZOR4',
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    try {
      const sendMailPromises = emails.map(email =>
        transporter.sendMail({
          from: 'etiquetas@aionnet.net',
          to: email,
          subject,
          text: message,
        })
      );

      await Promise.all(sendMailPromises);

      res.status(200).json({ message: 'Correos enviados exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al enviar los correos' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}