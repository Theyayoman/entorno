import sequelize from "@/lib/sequelize"; // Asegúrate de importar correctamente tu conexión

export default async function handler(req, res) {
  try {
    await sequelize.authenticate();
    res.status(200).json({ message: "✅ Conexión establecida correctamente." });
  } catch (error) {
    res.status(500).json({ message: "❌ Error de conexión", error: error.message });
  }
}