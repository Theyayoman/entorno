import FormulariosEstrategias from "@/models/FormulariosEstrategias"; // Modelo de FormulariosEstrategias

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    // Obtener los eventos de la tabla 'formularios_estrategias' donde 'eliminado' sea 0
    const eventos = await FormulariosEstrategias.findAll({
      where: { eliminado: 0 },
      order: [["fecha_actualizacion", "DESC"]],
    });

    // Procesar los eventos para manejar el campo 'formulario' (JSON o texto)
    const eventosProcesados = eventos.map(evento => {
      let datos = evento.formulario;

      // Intentar parsear el formulario si es un string JSON
      try {
        datos = JSON.parse(datos);
      } catch (error) {
        // Si no es un JSON válido, dejamos el valor tal cual
        datos = evento.formulario; // Mantener el valor original
      }

      return {
        ...evento.toJSON(), // Convertir el evento a objeto plano
        formulario: datos, // Asignar el formulario procesado
      };
    });

    // Retorna los eventos en formato JSON
    res.status(200).json(eventosProcesados);
  } catch (error) {
    console.error("Error al obtener los eventos:", error);
    res.status(500).json({ message: "Error al obtener los eventos" });
  }
}