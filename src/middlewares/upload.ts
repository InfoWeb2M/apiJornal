import multer, { type FileFilterCallback } from "multer";
import path from "path";
import crypto from "crypto";
import type { Request } from "express";

// storage em memória
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 5MB
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    if (!file.mimetype.startsWith("image/") && !file.mimetype.startsWith("video/")) {
      cb(new Error("Tipo de arquivo inválido"));
      return;
    }
    cb(null, true);
  }
});
