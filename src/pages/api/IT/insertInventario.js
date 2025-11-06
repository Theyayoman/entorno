import InventarioIT from "@/models/Inventario";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Método no permitido" });
  }

  const { tipo, marca, modelo, serial, etiquetas, fecha, observacion } = req.body;

  try {
    // Insertar el nuevo equipo en la base de datos
    const nuevoEquipo = await InventarioIT.create({
      tipo,
      marca,
      modelo,
      serie: serial,
      etiqueta: JSON.stringify(etiquetas), // Guardar etiquetas como string JSON
      fecha,
      observacion,
    });

    res.status(200).json({ success: true, data: nuevoEquipo });
  } catch (error) {
    console.error("Error al agregar el equipo:", error);
    res.status(500).json({ success: false, error: "Error al agregar el equipo" });
  }
}