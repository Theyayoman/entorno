import Actor from "@/models/Actores";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    // Obtener todos los proveedores ordenados por ID ascendente
    const actores = await Actor.findAll({
      where: { eliminado: 0 },
      order: [['id', 'ASC']]
    });

    // Retornar los proveedores en formato JSON
    return res.status(200).json({ success: true, actores });
  } catch (error) {
    console.error('Error al obtener los actores:', error);
    return res.status(500).json({ message: 'Error al obtener los actores' });
  }
}