import TipoMateriaPrima from "@/models/TiposMateriasPrimas";
import { Op } from "sequelize";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { nivel, group } = req.query;
  const options = {
    where: { nivel: { [Op.not]: null }},
    order: [['nivel', 'ASC']]
  };

  if (group) {
    options.group = [group];
  }

  if (nivel) {
    options.where.nivel = nivel;
  }

  try {
    // Obtener todas las categorías ordenadas por ID ascendente
    const categorias = await TipoMateriaPrima.findAll(options);

    // Retornar las categorías en formato JSON
    return res.status(200).json({ success: true, categorias });
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    return res.status(500).json({ message: 'Error al obtener las categorías', error });
  }
}