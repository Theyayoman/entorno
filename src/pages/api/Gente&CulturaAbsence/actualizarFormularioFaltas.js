import FormulariosFaltas from '@/models/FormulariosFaltas';
import moment from 'moment-timezone';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const {
    formData,
    tipoFormulario2,
    formularioExt,
    grupoFormulario,
  } = req.body;

  const { id } = req.query;
  const estatus = "Pendiente";

  const formulario_id = grupoFormulario || uuidv4(); // Si edita, usa el mismo ID

  const fechaInicio = formData.fechaInicio ? new Date(formData.fechaInicio) : null;
  let fechaFin = formData.fechaFin ? new Date(formData.fechaFin) : null;

  try {
    if (!fechaInicio && !fechaFin) {
      // Solo crea un registro con NULL si no hay fechas
      if (grupoFormulario) {
        // Modo edición: eliminar existentes primero
        await FormulariosFaltas.destroy({ where: { formulario_id } });
      }

      await FormulariosFaltas.create({
        formulario_id,
        formulario: JSON.stringify(formData),
        id_usuario: id,
        estatus,
        archivo: formData.comprobante || null,
        tipo: tipoFormulario2,
        fecha_inicio: null,
        fecha_fin: null,
        extemporanea: formularioExt,
      });

      return res.status(201).json({ message: 'Formulario guardado correctamente (sin fechas)' });
    }

    if (fechaInicio && !fechaFin) {
      fechaFin = new Date(fechaInicio);
    }

    // Calcular cuántas semanas abarca el nuevo rango
    const semanas = [];
    let tempStart = new Date(fechaInicio);
    let tempEnd = new Date(fechaFin);

    while (tempStart <= tempEnd) {
      const startOfWeek = new Date(tempStart);
      const dayOfWeek = startOfWeek.getDay();
      const daysToWednesday = (3 - dayOfWeek + 7) % 7;
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + daysToWednesday);

      semanas.push({ start: new Date(startOfWeek), end: new Date(endOfWeek) });

      tempStart = new Date(endOfWeek);
      tempStart.setDate(tempStart.getDate() + 1);

      // Asegurar que comienza en jueves
      const nextDayOfWeek = tempStart.getDay();
      if (nextDayOfWeek !== 4) {
        const daysToNextThursday = (4 - nextDayOfWeek + 7) % 7;
        tempStart.setDate(tempStart.getDate() + daysToNextThursday);
      }
    }

    if (grupoFormulario) {
      const registrosExistentes = await FormulariosFaltas.findAll({
        where: { formulario_id }
      });

      if (semanas.length > 1 || registrosExistentes.length > 1) {
        // Siempre elimina si hay múltiples semanas nuevas o múltiples registros existentes
        await FormulariosFaltas.destroy({ where: { formulario_id } });
      } else if (registrosExistentes.length === 1 && semanas.length === 1) {
        // Solo actualiza si hay un registro y es una sola semana
        const registro = registrosExistentes[0];
        registro.formulario = JSON.stringify(formData);
        registro.archivo = formData.comprobante || null;
        registro.tipo = tipoFormulario2;
        registro.fecha_inicio = moment(fechaInicio).tz('America/Mexico_City').format();
        registro.fecha_fin = moment(fechaFin).tz('America/Mexico_City').format();
        registro.extemporanea = formularioExt;
        await registro.save();
      
        return res.status(200).json({ message: 'Formulario actualizado correctamente (una semana)' });
      } else {
        return res.status(400).json({ message: 'No se pudo actualizar el formulario' });
      }      
    }

    // Insertar múltiples semanas (nuevo o edición)
    let currentStartDate = new Date(fechaInicio);

    for (const semana of semanas) {
      const fechaInicioLocal = moment(semana.start).tz('America/Mexico_City').format();
    
      const isLastWeek = semana === semanas[semanas.length - 1];
      const fechaFinReal = isLastWeek ? fechaFin : semana.end;
      const fechaFinLocal = moment(fechaFinReal).tz('America/Mexico_City').format();
    
      await FormulariosFaltas.create({
        formulario_id,
        formulario: JSON.stringify(formData),
        id_usuario: id,
        estatus,
        archivo: formData.comprobante || null,
        tipo: tipoFormulario2,
        fecha_inicio: fechaInicioLocal,
        fecha_fin: fechaFinLocal,
        extemporanea: formularioExt,
      });
    }    

    res.status(201).json({ message: grupoFormulario ? 'Formulario actualizado con nuevas semanas' : 'Formulario guardado correctamente con división por semanas' });
  } catch (error) {
    console.error('Error guardando el formulario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}