import multer from "multer";

const storage = multer.memoryStorage();

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
  limits: { fileSize: 1024 * 1024 * 10 },
  fileFilter: fileFilter
});
