import { put, del } from "@vercel/blob";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { server } from "../config/config.js";
import { serviceBlob } from "../config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta local
const UPLOADS_DIR = path.join(__dirname, "..", "..", "public", "uploads");

// Crea carpeta uploads si no existe
if (!server.isProduction && !fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * Guardar archivo en storage (local o blob segun el entorno)
 * @param {Buffer} fileBuffer - Buffer del archivo
 * @param {string} fileName - Nombre del archivo
 * @returns {Promise<string>} - URL del archivo guardado
 */
export const uploadFile = async (fileBuffer, fileName) => {
  if (server.isProduction) {
    // Produccion: usar Vercel Blob
    const blob = await put(`fotaza/${fileName}`, fileBuffer, {
      access: "public",
      token: serviceBlob.vercelBlobToken,
    });
    return blob.url;
  } else {
    // Desarrollo: guarda en carpeta local
    const filePath = path.join(UPLOADS_DIR, fileName);
    fs.writeFileSync(filePath, fileBuffer);
    return `/uploads/${fileName}`;
  }
};

/**
 * Eliminar archivo del storage (local o blob segun el entorno)
 * @param {string} filePath - Ruta o URL del archivo
 * @returns {Promise<boolean>} - true si se elimino, false si no
 */
export const deleteFile = async (filePath) => {
  if (server.isProduction) {
    // Produccion: eliminar de Vercel Blob
    if (filePath && filePath.includes("public.blob.vercel-storage.com")) {
      try {
        await del(filePath, { token: serviceBlob.vercelBlobToken });
        return true;
      } catch (err) {
        console.error("Error al borrar de Vercel Blob:", err);
        return false;
      }
    }
    return false;
  } else {
    // Desarrollo: eliminar archivo local
    try {
      if (filePath.startsWith("/uploads/")) {
        const fileName = filePath.replace("/uploads/", "");
        const fullPath = path.join(UPLOADS_DIR, fileName);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error("Error al borrar archivo local:", err);
      return false;
    }
  }
};

/**
 * Verificar si una URL es de storage remoto (Blob)
 * @param {string} filePath - Ruta o URL del archivo
 * @returns {boolean} - true si es de Blob
 */
export const isRemoteFile = (filePath) => {
  return filePath && filePath.includes("public.blob.vercel-storage.com");
};
