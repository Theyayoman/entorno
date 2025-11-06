import Usuario from '@/models/Usuarios';
import Permiso from '@/models/Permisos';

export default async function handler(req, res) {
  const { id: userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'El id del usuario es necesario' });
  }

  try {
    if (req.method === 'GET') {
      // Recuperar permisos del usuario
      const usuario = await Usuario.findOne({
        where: { id: userId },
        include: {
          model: Permiso,
          attributes: ['id', 'seccion', 'campo']
        }
      });

      if (usuario && usuario.Permiso) {
        let permiso = usuario.Permiso;

        // Intentar parsear si los valores están en formato TEXT
        try {
          permiso.seccion = JSON.parse(permiso.seccion);
        } catch (e) {
          permiso.seccion = permiso.seccion || []; // En caso de error, asignar array vacío
        }

        try {
          permiso.campo = JSON.parse(permiso.campo);
        } catch (e) {
          permiso.campo = permiso.campo || {}; // En caso de error, asignar objeto vacío
        }

        return res.status(200).json({
          message: 'Permisos existentes encontrados',
          permiso,
        });
      } else {
        return res.status(404).json({ message: 'No se encontraron permisos para este usuario' });
      }
    } else if (req.method === 'POST') {
      const { selections } = req.body;

      // Convertir selecciones en JSON
      const combinedSelections = selections.reduce((acc, selection) => {
        const seccion = selection.seccion;
        const campo = selection.campo;

        if (acc[seccion]) {
          acc[seccion].push(campo);
        } else {
          acc[seccion] = [campo];
        }
        return acc;
      }, {});

      const seccionJson = JSON.stringify(Object.keys(combinedSelections));
      const campoJson = JSON.stringify(combinedSelections);

      // Comprobar si ya existen permisos para el usuario
      const usuario = await Usuario.findOne({
        where: { id: userId },
        include: {
          model: Permiso,
          attributes: ['id', 'seccion', 'campo']
        }
      });

      if (usuario && usuario.Permiso) {
        let permiso = usuario.Permiso;
        let seccionExistente, campoExistente;

        try {
          seccionExistente = JSON.parse(permiso.seccion);
        } catch (e) {
          seccionExistente = typeof permiso.seccion === 'string' ? permiso.seccion.split(',') : [];
        }

        try {
          campoExistente = JSON.parse(permiso.campo);
        } catch (e) {
          campoExistente = typeof permiso.campo === 'string' ? JSON.parse(permiso.campo) : {};
        }

        // Fusionar permisos existentes con los nuevos
        const nuevaSeccion = [...new Set([...seccionExistente, ...Object.keys(combinedSelections)])];
        const nuevoCampo = { ...campoExistente, ...combinedSelections };

        // Actualizar permisos
        await permiso.update({
          seccion: JSON.stringify(nuevaSeccion),
          campo: JSON.stringify(nuevoCampo)
        });

        return res.status(200).json({
          message: 'Permisos del usuario actualizados correctamente',
        });
      } else {
        // Crear nuevo permiso
        const nuevoPermiso = await Permiso.create({
          seccion: seccionJson,
          campo: campoJson
        });

        // Asociar permiso con el usuario
        await usuario.update({ id_permiso: nuevoPermiso.id });

        return res.status(200).json({
          message: 'Permiso creado y asignado al usuario exitosamente',
          permisoId: nuevoPermiso.id,
        });
      }
    } else {
      res.status(405).json({ message: 'Método no permitido' });
    }
  } catch (error) {
    console.error('Error al obtener la conexión:', error);
    return res.status(500).json({ message: 'Error al obtener la conexión' });
  }
}