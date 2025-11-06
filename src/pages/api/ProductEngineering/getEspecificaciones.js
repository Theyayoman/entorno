import SubcategoriaMateriaPrima from '@/models/SubcategoriasMateriasPrimas';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const { TipoId, categoriaId } = req.query;

    const options = {
      order: [['id', 'ASC']]
    };

    if (TipoId) {
      options.where = { Tipo_id: TipoId };
    }

    if (categoriaId) {
      options.where = { Categoria_id: categoriaId };
    }

    // Obtener todas las subcategorías ordenadas por ID ascendente
    const especificaciones = await SubcategoriaMateriaPrima.findAll( options );

    // Retornar las especificaciones en formato JSON
    return res.status(200).json({ success: true, especificaciones });
  } catch (error) {
    console.error('Error al obtener las especificaciones:', error);
    return res.status(500).json({ message: 'Error al obtener las especificaciones' });
  }
}