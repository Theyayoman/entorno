import Vacante from "@/models/Vacantes";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const {
    vacante,
    cantidad,
    gerencia,
    proceso_actual,
    ubicacion,
    salarioMin,
    salarioMax,
    fecha_apertura,
    fecha_ingreso,
    observaciones,
  } = req.body;

  const salario = `${salarioMin}-${salarioMax}`;
  const ingreso = fecha_ingreso || null;

  try {
    // Crear nueva vacante en la base de datos
    const nuevaVacante = await Vacante.create({
      vacante,
      cantidad,
      gerencia,
      proceso_actual,
      ubicacion,
      salario,
      fecha_apertura,
      fecha_ingreso: ingreso,
      observaciones,
    });

    res.status(201).json({ 
      message: "Formulario guardado correctamente", 
      insertId: nuevaVacante.id 
    });
  } catch (error) {
    console.error("Error guardando el formulario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
}