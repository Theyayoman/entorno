import fs from "fs";
import { Client } from "basic-ftp";
import path from "path";
import formidable from "formidable";
import Producto from "@/models/Productos";
import ImagenProducto from "@/models/ImagenesProductos";
import { Op } from "sequelize";

// Configuración para evitar que Next.js maneje el bodyParser automáticamente
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const form = new formidable.IncomingForm({
    multiples: true,
    uploadDir: "/tmp",
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error procesando el formulario:", err);
      return res
        .status(500)
        .json({ message: "Error al procesar el formulario" });
    }

    console.log("Archivos recibidos:", files);
    console.log("Campos recibidos:", fields); // Ahora veremos las imágenes existentes

    const {
      id,
      nombre,
      proveedor,
      categoriaGeneral,
      subcategoria,
      especificacion,
      medicion,
      codigo,
      costo,
      compraMinima,
      descripcion,
      fecha_evaluacion,
      veredicto,
    } = fields;

    const safeValues = {
      nombre: nombre || null,
      proveedor_id: proveedor || null,
      Tipo_id: categoriaGeneral || null,
      Categoria_id: subcategoria || null, // Suponiendo que 'categoriaGeneral' se mapea a 'Categoria_id'
      Subcategoria_id: especificacion || null,
      codigo: codigo || null,
      costo: costo || null,
      cMinima: compraMinima || null,
      medicion: medicion || null,
      descripcion: descripcion || null,
    };

    const imagenesExistentes = Object.keys(fields)
      .filter((key) => key.startsWith("imagenesExistentes"))
      .map((key) => fields[key]);

    const imagenesNuevas = Array.isArray(files.imagenes)
      ? files.imagenes
      : files.imagenes
      ? [files.imagenes]
      : [];

    console.log("Imágenes existentes:", imagenesExistentes);
    console.log("Imágenes nuevas:", imagenesNuevas);

    try {
      // 🔹 **Actualizar datos del producto antes de modificar imágenes**
      await Producto.update(safeValues, {
        where: { id },
      });

      console.log("✅ Datos del producto actualizados correctamente.");

      const currentImages = await ImagenProducto.findAll({
        where: {
          producto_id: id,
          tipo: {
            [Op.in]: [1, 3],
          },
        },
        attributes: ["id", "ruta"],
      });

      // Combinamos las imágenes existentes con las nuevas
      const allImagePaths = [
        ...imagenesExistentes,
        ...imagenesNuevas.map(
          (file) => `/uploads/imagenesProductos/${file.name}`
        ),
      ];

      // Encontrar imágenes que se deben eliminar
      const imagesToDelete = currentImages.filter(
        (image) => !allImagePaths.includes(image.ruta)
      );

      // Eliminar de la base de datos solo las imágenes que ya no están en la nueva lista
      for (const image of imagesToDelete) {
        await ImagenProducto.destroy({ where: { id: image.id } });
      }

      // Subir las nuevas imágenes y agregarlas a la base de datos
      const uploadedImages = [];
      for (const file of imagenesNuevas) {
        const filePath = `/uploads/imagenesProductos/${file.name}`;
        uploadedImages.push({ ruta: filePath, producto_id: id, tipo: 3 });

        // Subir al FTP
        const client = new Client();
        client.ftp.verbose = true;
        await client.access({
          host: "50.6.199.166",
          user: "aionnet",
          password: "Rrio1003",
          secure: false,
        });

        try {
          await client.uploadFrom(file.path, filePath);
          console.log(`Archivo subido con éxito a: ${filePath}`);
        } catch (uploadErr) {
          console.error(`Error subiendo el archivo ${file.name}:`, uploadErr);
          return res
            .status(500)
            .json({ message: "Error al subir el archivo al FTP" });
        }
        client.close();

        // Eliminar el archivo temporal
        try {
          fs.unlinkSync(file.path);
          console.log(`Archivo temporal ${file.path} eliminado.`);
        } catch (unlinkErr) {
          console.error("Error al eliminar el archivo temporal:", unlinkErr);
        }
      }

      // Guardar las nuevas imágenes en la base de datos
      await ImagenProducto.bulkCreate(uploadedImages);

      res
        .status(200)
        .json({
          success: true,
          message: "Producto e imágenes actualizadas correctamente",
        });
    } catch (error) {
      console.error("Error actualizando el producto:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  });
}
