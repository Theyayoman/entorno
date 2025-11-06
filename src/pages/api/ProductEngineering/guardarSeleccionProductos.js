import Pedido from '@/models/Pedidos'; // Modelo Cmd
import PedidoDetalle from '@/models/PedidosDetalle'; // Modelo Cmddetalle

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { productIds, userId } = req.body; // Recibes los IDs de los productos seleccionados y el ID del usuario.

  if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ message: 'Los IDs de los productos son requeridos' });
  }

  if (!userId) {
    return res.status(400).json({ message: 'El ID del usuario es requerido' });
  }

  try {
    // 1. Crear el pedido en la tabla 'cmd'
    const cmd = await Pedido.create({
      created_for: userId,
    });

    // 2. Insertar los productos seleccionados en la tabla intermedia 'cmddetalle'
    const cmddetalleValues = productIds.map((productId) => ({
      cmd_id: cmd.id,
      producto_id: productId,
    }));

    await PedidoDetalle.bulkCreate(cmddetalleValues);

    res.status(201).json({ success: true, message: 'Pedido guardado correctamente' });
  } catch (error) {
    console.error('Error guardando el pedido:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}