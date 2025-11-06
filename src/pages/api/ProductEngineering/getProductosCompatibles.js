import CategoriaMateriaPrima from '@/models/CategoriasMateriasPrimas';
import Compatibilidad from '@/models/Compatibilidades';
import ImagenProducto from '@/models/ImagenesProductos';
import Producto from '@/models/Productos';
import Proveedor from '@/models/Proveedores';
import SubcategoriaMateriaPrima from '@/models/SubcategoriasMateriasPrimas';
import TipoMateriaPrima from '@/models/TiposMateriasPrimas';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    try {    
        const { codigo, tipo, categoria, subcategoria } = req.query;
        const whereConditions = {};
        
        if (codigo) {
            whereConditions.codigo_producto = codigo;
        }
        
        if (tipo) {
            whereConditions.compatibilidad_tipo = tipo;
        }

        if (categoria) {
            whereConditions.compatibilidad_categoria = categoria;
        }
        
        if (subcategoria) {
            whereConditions.compatibilidad_subcategoria = subcategoria;
        }
        
        const compatibles = await Compatibilidad.findAll({ 
            where: whereConditions,
            include: [
                { 
                    model: Producto,
                    as: 'compatible',
                    include: [
                        { model: Proveedor, as: "proveedor", attributes: ["nombre"] },
                        { model: TipoMateriaPrima, as: "categoria", attributes: ["nombre"] },
                        { model: CategoriaMateriaPrima, as: "subcategoria", attributes: ["nombre"] },
                        { model: SubcategoriaMateriaPrima, as: "especificacion", attributes: ["nombre"] },
                        {
                            model: ImagenProducto,
                            attributes: ['ruta', 'tipo'],
                            as: 'imagenes',
                          },
                      ],
                }
            ],
            attributes: [] // No devolver campos de la tabla compatibilidades
        });

        const productosCompatibles = compatibles.map(item => item.compatible);

        const productosCompatiblesConImagenes = productosCompatibles.map(producto => {
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



        res.status(200).json({ 
            success: true,
            products: productosCompatiblesConImagenes 
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener los productos compatibles ' + error 
        });
    }
    
}