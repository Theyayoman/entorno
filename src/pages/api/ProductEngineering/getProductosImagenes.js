import Producto from '@/models/Productos';
import Proveedor from '@/models/Proveedores';
import TipoMateriaPrima from '@/models/TiposMateriasPrimas';
import CategoriaMateriaPrima from '@/models/CategoriasMateriasPrimas';
import SubcategoriaMateriaPrima from '@/models/SubcategoriasMateriasPrimas';
import ImagenProducto from '@/models/ImagenesProductos';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { tipoId, categoriaId, subcategoriaId } = req.query;

  try {
    // Construir los filtros
    const filters = {
      eliminado: 0,
      catalogo: 1,
      ...(tipoId && { Tipo_id: tipoId }),
      ...(categoriaId && { Categoria_id: categoriaId }),
      ...(subcategoriaId && { Subcategoria_id: subcategoriaId }),
    };

    // Obtener los productos filtrados
    const productos = await Producto.findAll({
      where: filters,
      include: [
        {
          model: Proveedor,
          attributes: ['nombre'],
          as: 'proveedor',
        },
        {
          model: TipoMateriaPrima,
          attributes: ['nombre'],
          as: 'categoria',
        },
        {
          model: CategoriaMateriaPrima,
          attributes: ['nombre'],
          as: 'subcategoria',
        },
        {
          model: SubcategoriaMateriaPrima,
          attributes: ['nombre'],
          as: 'especificacion',
        },
        {
          model: ImagenProducto,
          attributes: ['ruta', 'tipo'],
          as: 'imagenes',
        },
      ],
      order: [['id', 'ASC']],
    });

    // Procesar las imágenes para devolverlas como array
    const productosConImagenes = productos.map(producto => {
      const imagenes = producto.imagenes.filter((img) => img.tipo === 1 || img.tipo === 3).map(img => img.ruta);
      return {
        ...producto.toJSON(),
        nombre_proveedor: producto.proveedor?.nombre || null,
        nombre_categoria: producto.categoria?.nombre || null,
        nombre_subcategoria: producto.subcategoria?.nombre || null,
        nombre_especificacion: producto.especificacion?.nombre || null,
        imagenes,
      };
    });

    return res.status(200).json({ success: true, products: productosConImagenes });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    return res.status(500).json({ message: 'Error al obtener los productos', error });
  }
}