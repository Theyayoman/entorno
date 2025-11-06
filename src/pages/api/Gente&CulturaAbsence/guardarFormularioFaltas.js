import FormulariosFaltas from '@/models/FormulariosFaltas';
import moment from 'moment-timezone';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { formData, tipoFormulario2, formularioNormalOExtemporaneo } = req.body;
  const { id } = req.query;
  const estatus = "Pendiente";
  const tipo = formularioNormalOExtemporaneo === "Extemporánea" ? 1 : 0;
  const formulario_id = uuidv4();

  const fechaInicio = formData.fechaInicio ? new Date(formData.fechaInicio) : null;
  let fechaFin = formData.fechaFin ? new Date(formData.fechaFin) : null;

  try {
    // Si no hay fechas, insertar un solo registro con valores NULL
    if (!fechaInicio && !fechaFin) {
      await FormulariosFaltas.create({
        formulario_id,
        formulario: JSON.stringify(formData),
        id_usuario: id,
        estatus,
        archivo: formData.comprobante || null,
        tipo: tipoFormulario2,
        fecha_inicio: null,
        fecha_fin: null,
        extemporanea: tipo,
      });
      res.status(201).json({ message: 'Formulario guardado correctamente (sin fechas)' });
      return;
    }

    // Si solo hay fechaInicio, la fechaFin será la misma
    if (fechaInicio && !fechaFin) {
      fechaFin = new Date(fechaInicio);
    }

    let currentStartDate = new Date(fechaInicio);

    while (currentStartDate <= fechaFin) {
      // Calcular el miércoles de corte de la semana de nómina
      let currentEndDate = new Date(currentStartDate);
      let dayOfWeek = currentEndDate.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
      let daysToNextWednesday = (3 - dayOfWeek + 7) % 7; // 3 representa miércoles
      currentEndDate.setDate(currentEndDate.getDate() + daysToNextWednesday);

      // Si hay fechaFin, asegurarse de no excederla
      if (currentEndDate > fechaFin) {
        currentEndDate = new Date(fechaFin);
      }

      // Convertir fechaFin a la zona horaria local
      const fechaFinLocal = moment(currentEndDate).tz('America/Mexico_City').format();

      // Convertir fechaInicio a la zona horaria local
      const fechaInicioLocal = moment(currentStartDate).tz('America/Mexico_City').format();

      // Insertar en la base de datos usando Sequelize
      await FormulariosFaltas.create({
        formulario_id,
        formulario: JSON.stringify(formData),
        id_usuario: id,
        estatus,
        archivo: formData.comprobante || null,
        tipo: tipoFormulario2,
        fecha_inicio: fechaInicioLocal,
        fecha_fin: fechaFinLocal,
        extemporanea: tipo,
      });

      // Mover la fecha de inicio al siguiente jueves
      currentStartDate = new Date(currentEndDate);
      currentStartDate.setDate(currentStartDate.getDate() + 1);

      // Asegurar que el nuevo inicio sea jueves
      let newDayOfWeek = currentStartDate.getDay();
      if (newDayOfWeek !== 4) {
        let daysToNextThursday = (4 - newDayOfWeek + 7) % 7;
        currentStartDate.setDate(currentStartDate.getDate() + daysToNextThursday);
      }
    }

    res.status(201).json({ message: 'Formulario guardado correctamente con división por semanas de nómina' });
  } catch (error) {
    console.error('Error guardando el formulario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}