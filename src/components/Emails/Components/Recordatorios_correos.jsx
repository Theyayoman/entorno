"use client"
import { useSession } from "next-auth/react"

export function SubirArchivo() {
    const { data: session, status } = useSession();
    const idEtiqueta = 139;

    const handleSave =async()=>{

        if (session) {
          const userEmail1 = session.user.email;
      
          // Definir los destinatarios y orden
          const emailFlow1 = {
            "guscardenas63@gmail.com": "gustavo.cardenas5755@alumnos.udg.mx",
            "gustavo.cardenas5755@alumnos.udg.mx": "jrjuanramirez123@gmail.com",
          };
      
          // Verificar el correo del usuario actual y enviar el aviso al siguiente
          const nextRecipient = emailFlow1[userEmail1];
          if (nextRecipient) {
            try {
              // Hacer la petición a la API para enviar el correo
              const response = await fetch('/api/send-mailEdit', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  recipientEmail: nextRecipient,
                  subject: 'Etiqueta editada',
                  message: `La etiqueta ha sido editada por ${session.user.name}. Por favor, revísala.\nEste es el enlace de la etiqueta para que puedas editarla: http://localhost:3000/marketing/Editar?id=${idEtiqueta}\nAsegúrate de iniciar sesión con tu usuario antes de hacer clic en el enlace.`,
                }),
              });
      
              if (response.ok) {
                console.log('Correo enviado a:', nextRecipient);
              } else {
                console.error('Error al enviar el correo');
              }
            } catch (error) {
              console.error('Error al enviar la petición:', error);
            }
          }
        }
      };

    return (
        <div>
            <button onClick={handleSave}>Enviar correo</button>
        </div>
    );
}
