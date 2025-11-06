"use client"
import { useSession } from "next-auth/react"

export function SubirArchivo() {
    const { data: session, status } = useSession();

    const handleSave = async () => {
        if (session) {
            const userEmail1 = "guscardenas63@gmail.com";
            const nextRecipient = userEmail1;
    
            if (nextRecipient) {
                try {
                    const response = await fetch('https://hook.us2.make.com/5seupqsxvc4x5tt7xy9qr2hupivz0qgk', { // Asegúrate de que la URL sea correcta
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            recipientEmail: nextRecipient,
                            subject: 'Etiqueta Editada',
                            message: `La etiqueta ha sido editada por ${session.user.name}. 
                            Por favor, revisa la etiqueta editada [haciendo clic aquí](https://hook.us2.make.com/aqt8gvb4jq2r4uyq3s79dbvru6u41la6?email=${encodeURIComponent(nextRecipient)})`,
                        }),
                    });
    
                    if (response.ok) {
                        console.log('Datos enviados a Integromat');
                    } else {
                        console.error('Error al enviar datos a Integromat:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error al enviar datos a Integromat:', error);
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
