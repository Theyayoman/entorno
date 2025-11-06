const path = require("path");
const fs = require("fs");

const isVercel = process.env.VERCEL === "1";

const uploadDir = isVercel
  ? "/tmp"
  : path.join(process.cwd(), "uploads");

// Crear la carpeta 'uploads' si no existe (solo en desarrollo/local)
if (!isVercel && !fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

module.exports = {
  uploadDir,
  isVercel,
};