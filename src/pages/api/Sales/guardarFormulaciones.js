import Levantamiento from "@/models/Levantamientos";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { levantamiento } = req.body;

  if (!levantamiento) {
    return res.status(400).json({ error: "Faltan parámetros requeridos" });
  }

  try {
    await Levantamiento.update({
        formula: levantamiento.formula || null,
        formula_text: levantamiento.formula_text || null,
        dosificacion: levantamiento.dosificacion || null,
        dosificacion_text: levantamiento.dosificacion_text || null,
        loteado: levantamiento.loteado || null,
        loteado_lenguaje: levantamiento.loteado_lenguaje || null,
        loteado_caducidad: levantamiento.loteado_caducidad || null,
    }, { where: { id: levantamiento.id } });

    res.status(200).json({ success: true, message: "Formulaciones guardadas exitosamente" });
  } catch (error) {
    console.error("Error al guardar las formulaciones:", error);
    res.status(500).json({ error: "Error al guardar las formulaciones" });
  }
}