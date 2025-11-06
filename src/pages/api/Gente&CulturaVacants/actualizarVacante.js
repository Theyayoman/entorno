import Vacante from "@/models/Vacantes";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { 
    id, 
    vacante, 
    cantidad, 
    gerencia, 
    proceso_actual, 
    ubicacion, 
    salarioMin, 
    salarioMax, 
    fecha_apertura, 
    fecha_ingreso, 
    observaciones 
  } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID es requerido" });
  }

  try {
    // Generar el rango de salario
    const salario = `${salarioMin}-${salarioMax}`;
    console.log("Salario mínimo:", salarioMin);
    console.log("Salario máximo:", salarioMax);
    console.log("Rango de salario:", salario);

    // Buscar y actualizar la vacante
    const [updated] = await Vacante.update(
      {
        vacante,
        cantidad,
        gerencia,
        proceso_actual,
        ubicacion,
        salario,
        fecha_apertura,
        fecha_ingreso,
        observaciones
      },
      { where: { id } }
    );

    if (updated > 0) {
      return res.status(200).json({ message: "Vacante actualizada exitosamente" });
    } else {
      return res.status(404).json({ message: "Vacante no encontrada" });
    }
  } catch (error) {
    console.error("Error al actualizar la vacante:", error);
    return res.status(500).json({ message: "Error al actualizar la vacante" });
  }
}