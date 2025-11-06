import Usuario from "@/models/Usuarios";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Método no permitido" });
  }

  try {
    // Obtener el número de empleado más alto
    let maxNumeroEmpleado = await Usuario.max("numero_empleado");
    maxNumeroEmpleado++;

    return res.status(200).json({
      success: true,
      numeroEmpleado: maxNumeroEmpleado
    });

  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
}