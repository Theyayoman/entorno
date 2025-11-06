import Proveedor from '@/models/Proveedores';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    // Obtener todos los proveedores ordenados por ID ascendente
    const proveedores = await Proveedor.findAll({
      where: { eliminado: 0 },
      order: [['id', 'ASC']]
    });

    // Retornar los proveedores en formato JSON
    return res.status(200).json({ success: true, proveedores });
  } catch (error) {
    console.error('Error al obtener los proveedores:', error);
    return res.status(500).json({ message: 'Error al obtener los proveedores' });
  }
}