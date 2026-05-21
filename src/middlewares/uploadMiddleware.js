import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../../public/uploads");

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const newName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + newName + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/webm",
  ];

  if (allowedExtensions.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Formato incorrecto. Solo se permiten imágenes (JPG, PNG, WEBP) y videos (MP4, WEBM).",
      ),
      false,
    );
  }
};

export const uploadMiddleware = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 50 }, // Aumentado a 50MB para soportar videos
  fileFilter: fileFilter,
});
