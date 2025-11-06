import Usuario from "@/models/Usuarios";
import Departamento from "@/models/Departamentos";
import Empresa from "@/models/Empresas";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Método no permitido" });
  }

  try {
    // Consultar usuarios con sus departamentos y empresas asociadas
    const usuarios = await Usuario.findAll({
      where: { eliminado: 0 },
      include: [
        {
          model: Departamento,
          attributes: [
            ['nombre', 'nombre_dpto'], // Alias para el campo 'nombre'
            ['id', 'id_dpto'],         // Alias para el campo 'id'
          ],
        },
        {
          model: Empresa,
          attributes: [
            ['formulario', 'empresa_usuario'], // Alias para el campo 'formulario'
          ],
        },
      ],
      order: [["nombre", "ASC"]],
      raw: true,
    });

    if (usuarios.length > 0) {

      const result = usuarios.map(user => ({
        ...user,
        nombre_dpto: user['Departamento.nombre_dpto'], // Accede al alias
        id_dpto: user['Departamento.id_dpto'],         // Accede al alias
        empresa_usuario: user['Empresa.empresa_usuario'], // Accede al alias
      }));

      return res.status(200).json({ success: true, users: result });
    } else {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
}