import InventarioIT from "@/models/Inventario";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    console.log("Iniciando consulta a la base de datos...");

    // Obtener todos los registros de inventario
    const inventario = await InventarioIT.findAll();

    console.log("Resultado de la consulta:", inventario);

    // Mapeamos los resultados para asegurarnos de que 'etiquetas' esté correctamente parseado
    const inventarioFormateado = inventario.map((item) => ({
      ...item.toJSON(),
      etiquetas: item.etiquetas ? JSON.parse(item.etiquetas) : [],
    }));

    res.status(200).json(inventarioFormateado);
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res.status(500).json({ error: "Error al obtener inventario" });
  }
}