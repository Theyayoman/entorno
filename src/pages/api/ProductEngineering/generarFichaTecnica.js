import * as ftp from "basic-ftp";
import fs from "fs";
import path from "path";
import IdentificadorProducto from "@/models/IdentificadoresProductos";
import Producto from "@/models/Productos";
import ImagenProducto from "@/models/ImagenesProductos";
const { uploadDir } = require("@/lib/configUpload");

// Funcion para obtener la extension de la imagen
const getExtensionFromBase64 = (base64) => {
    const match = base64?.match(/^data:image\/([a-zA-Z0-9+]+);base64,/);
    return match ? match[1] : null; // ejemplo: "png", "jpeg", etc.
};

// Funcion para subir la imagen al FTP
async function subirImagenFTP(nombreArchivo, base64) {
    if (!base64 || typeof base64 !== "string" || !base64.startsWith("data:image")) {
        console.warn("No se recibió una imagen nueva. No se subirá nada al FTP.");
        return null;
    }

    const client = new ftp.Client();

    try {
      await client.access({
        host: "50.6.199.166",
        user: "aionnet",
        password: "Rrio1003",
        secure: false,
      });
  
      const buffer = Buffer.from(base64.split(",")[1], "base64");

      const tempPath = path.join(uploadDir, nombreArchivo); // ✅ dinámico según entorno
      fs.writeFileSync(tempPath, buffer);
  
      await client.uploadFrom(tempPath, `/uploads/imagenesProductos/${nombreArchivo}`);
      fs.unlinkSync(tempPath); // eliminar archivo temporal
  
      await client.close();
      return `/uploads/imagenesProductos/${nombreArchivo}`;
    } catch (err) {
      console.error("Error subiendo imagen al FTP:", err);
      return null;
    }
  }  

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { idProductoValidar, productoAValidar, imagenSeleccionadaPreview, idUser } = req.body;

  if (!idProductoValidar || !productoAValidar) {
    return res.status(400).json({ error: "Faltan parámetros requeridos" });
  }

  try {
    for (const identificador of productoAValidar.identificadoresProductos) {
      const [registro, creado] = await IdentificadorProducto.findOrCreate({
        where: {
          producto_id: idProductoValidar,
          identificador_id: identificador.identificador_id,
        },
        defaults: {
          tolerado: identificador.tolerancia || null,
        },
      });

      if (!creado) {
        // Ya existía, hacemos update
        await registro.update({
          tolerado: identificador.tolerancia || null,
        });
      }
    }

    const productoAActualizar = await Producto.findByPk(idProductoValidar);
    await productoAActualizar.update({ 
      composicion: productoAValidar.producto?.composicion, 
      modo_empleo: productoAValidar.producto?.modo_empleo, 
      condiciones: productoAValidar.producto?.condiciones,
      consideracion: productoAValidar.producto?.consideracion,
      materia_extraña: productoAValidar.producto?.materia_extraña,
      tolerancias_por: idUser
    });

    if (imagenSeleccionadaPreview) {
        const extension = getExtensionFromBase64(imagenSeleccionadaPreview);
        const safeNombre = productoAValidar.producto?.nombre.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");
        const nombreArchivo = `${safeNombre}_imagen_plano_mecanico_${Date.now()}.${extension}`;
        const rutaFtp = await subirImagenFTP(nombreArchivo, imagenSeleccionadaPreview);
      
        if (rutaFtp) {
          const imagenExistente = await ImagenProducto.findOne({
            where: {
              producto_id: idProductoValidar,
              tipo: 2,
            },
          });

          if (imagenExistente) {
            await imagenExistente.destroy();
          }

          await ImagenProducto.create({
            ruta: rutaFtp,
            producto_id: idProductoValidar,
            tipo: 2,
          });
        }
      }      

    res.status(200).json({ success: true, message: "Ficha tecnica generada correctamente" });
  } catch (error) {
    console.error("Error al validar el producto:", error);
    res.status(500).json({ error: "Error al validar el producto" });
  }
}