import PedidoDetalle from '@/models/PedidosDetalle';
import Producto from '@/models/Productos';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    // Obtener pedidos con productos agrupados
    const pedidos = await PedidoDetalle.findAll({
      attributes: [
        'id',
        'cmd_id',
      ],
      include: [
        {
          model: Producto,
          attributes: ['nombre'], // Solo traer el nombre del producto
        }
      ],
      order: [['cmd_id', 'ASC']]
    });

    // Agrupar productos por cmd_id
    const pedidosAgrupados = pedidos.reduce((acc, pedido) => {
      const { cmd_id, id } = pedido;
      const nombreProducto = pedido.Producto?.nombre || '';

      if (!acc[cmd_id]) {
        acc[cmd_id] = {
          id,
          cmd_id,
          productosPedidos: []
        };
      }
      if (nombreProducto) {
        acc[cmd_id].productosPedidos.push(nombreProducto);
      }

      return acc;
    }, {});

    // Convertir a array y unir los nombres de productos con ', '
    const resultado = Object.values(pedidosAgrupados).map(pedido => ({
      ...pedido,
      productosPedidos: pedido.productosPedidos.join(', ')
    }));

    // Retornar la respuesta
    return res.status(200).json({ success: true, pedidos: resultado });

  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    return res.status(500).json({ message: 'Error al obtener los pedidos' });
  }
}