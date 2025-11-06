import { Client } from "basic-ftp";
import sharp from "sharp";
import { Writable } from "stream";
import path from "path";

function getWritableBufferStream() {
  const chunks = [];
  const writable = new Writable({
    write(chunk, encoding, callback) {
      chunks.push(chunk);
      callback();
    }
  });
  return { writable, getBuffer: () => Buffer.concat(chunks) };
}

export default async function handler(req, res) {
  const { rutaImagen } = req.query;

  if (!rutaImagen) {
    return res.status(400).json({ error: "Falta la ruta de la imagen" });
  }

  const ext = path.extname(rutaImagen).toLowerCase();

  const client = new Client();

  try {
    await client.access({
      host: "50.6.199.166",
      user: "aionnet",
      password: "Rrio1003",
      secure: false,
    });

    const { writable, getBuffer } = getWritableBufferStream();

    // Descargar archivo del FTP al stream en memoria
    await client.downloadTo(writable, rutaImagen);
    await client.close();

    const buffer = getBuffer();

    let dataUri;
    if (ext === ".svg") {
      // Convertir SVG a PNG usando sharp
      const pngBuffer = await sharp(buffer).png().toBuffer();
      const base64 = pngBuffer.toString("base64");
      dataUri = `data:image/png;base64,${base64}`;
    } else if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
      // Solo convertir a base64 y devolver con el mime correcto
      const base64 = buffer.toString("base64");
      const mimeType = ext === ".png" ? "image/png" : "image/jpeg";
      dataUri = `data:${mimeType};base64,${base64}`;
    } else {
      return res.status(400).json({ error: "Formato de imagen no soportado" });
    }

    return res.status(200).json({ base64: dataUri });
  } catch (error) {
    console.error("Error al procesar la imagen:", error);
    return res.status(500).json({ error: "No se pudo procesar la imagen" });
  }
}