import path from "path";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".webp" &&
      ext !== ".png" &&
      ext !== ".mp4"
    ) {
      return cb(new Error(`Unsupported file type! ${ext}`), false);
    }
    cb(null, true);
  },
});

export default upload;