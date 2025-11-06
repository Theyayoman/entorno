import Usuario from "@/models/Usuarios";
import Permiso from "@/models/Permisos";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "El id del usuario es necesario" });
    }

    try {
      const userPermissions = await Usuario.findOne({
        where: { id: userId },
        include: {
          model: Permiso,
          attributes: ["seccion", "campo"],
        },
      });

      const permiso = userPermissions?.Permiso;

      if (!permiso) {
        return res
          .status(404)
          .json({ message: "El usuario no tiene permisos asignados" });
      }

      let campoParseado;
      try {
        campoParseado =
          typeof permiso.campo === "string"
            ? JSON.parse(permiso.campo)
            : permiso.campo;
      } catch (error) {
        console.error("Error al parsear campo:", error);
        campoParseado = {};
      }

      const resultado = {
        campo: campoParseado,
        seccion: permiso.seccion,
      };

      res.status(200).json(resultado);
    } catch (error) {
      console.error("Error al obtener permisos", error);
      res.status(500).json({ message: "Error al obtener permisos" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Método ${req.method} no permitido` });
  }
}
