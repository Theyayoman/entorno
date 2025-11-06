import { literal } from "sequelize";
import Vacante from "@/models/Vacantes";
import Departamento from "@/models/Departamentos";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    // Obtener los eventos desde la tabla 'vacantes' con la relación a 'departamentos'
    const vacantes = await Vacante.findAll({
      where: { eliminado: 0 },
      attributes: [
        "id",
        "vacante",
        "cantidad",
        "gerencia",
        "proceso_actual",
        "ubicacion",
        "salario",
        [literal("CONVERT_TZ(fecha_apertura, '+00:00', '+06:00')"), "fecha_apertura"],
        [literal("CONVERT_TZ(fecha_ingreso, '+00:00', '+06:00')"), "fecha_ingreso"],
        "observaciones",
        "eliminado",
      ],
      include: [
        {
          model: Departamento,
          as: "departamento",
          attributes: ["nombre"],
        },
      ],
      order: [["id", "DESC"]],
    });

    res.status(200).json(vacantes);
  } catch (error) {
    console.error("Error al obtener los eventos:", error);
    res.status(500).json({ message: "Error al obtener los eventos" });
  }
}