import { Client } from "basic-ftp";
import sharp from "sharp";
import { Writable } from "stream";

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

    // Convertir SVG a PNG
    const pngBuffer = await sharp(buffer).png().toBuffer();
    const base64 = pngBuffer.toString("base64");
    const dataUri = `data:image/png;base64,${base64}`;

    return res.status(200).json({ base64: dataUri });
  } catch (error) {
    console.error("Error al procesar la imagen:", error);
    return res.status(500).json({ error: "No se pudo procesar la imagen" });
  }
}