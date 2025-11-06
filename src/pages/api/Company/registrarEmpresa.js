import Empresa from "@/models/Empresas"; // Modelo de Empresa

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { formulario } = req.body;
  console.log(formulario);

  try {
    // Guardar el formulario en la base de datos
    await Empresa.create({
      formulario: JSON.stringify(formulario),
    });

    res.status(201).json({ message: "Formulario guardado correctamente" });
  } catch (error) {
    console.error("Error guardando el formulario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
}