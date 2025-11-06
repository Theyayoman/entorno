import FormulariosEtiquetas from "@/models/FormulariosEtiquetas";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID es requerido" });
  }

  try {
    // Realizar la consulta con Sequelize
    const etiqueta = await FormulariosEtiquetas.findOne({
      where: { id },
    });

    if (!etiqueta) {
      return res.status(404).json({ message: "Etiqueta no encontrada" });
    }

    // Intentar parsear `datos_formulario` si es una cadena de texto
    const datos_formulario = parseJSON(etiqueta.datos_formulario) || {};
    const pdf_path = etiqueta.pdf_path || ''; // Valor por defecto si es null o undefined
    const estatus = etiqueta.estatus || '';

    // Combinar las columnas en un solo objeto
    const datos = {
      ...datos_formulario,  // Desestructurar los datos del formulario
      pdf: pdf_path,  // Agregar la columna pdf_path al objeto
      estatus: estatus
    };

    console.log("Datos obtenidos:", datos); // Verifica el contenido de los datos

    res.status(200).json(datos);
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    res.status(500).json({ message: "Error al obtener los datos" });
  }
}

// Función para intentar parsear JSON si es una cadena de texto
function parseJSON(value) {
  try {
    return typeof value === "string" ? JSON.parse(value) : value;
  } catch (error) {
    console.error("Error al parsear JSON:", value, error);
    return value; // Devuelve el valor original si hay un error
  }
}