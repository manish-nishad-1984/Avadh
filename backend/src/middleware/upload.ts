import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';

const createStorage = (subfolder: string) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(config.upload.dir, subfolder));
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${uuidv4()}${ext}`);
    },
  });
};

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WebP, GIF, SVG) are allowed'));
  }
};

export const uploadProductImage = multer({
  storage: createStorage('products'),
  fileFilter,
  limits: { fileSize: config.upload.maxFileSize },
});

export const uploadCategoryImage = multer({
  storage: createStorage('categories'),
  fileFilter,
  limits: { fileSize: config.upload.maxFileSize },
});

export const uploadBannerImage = multer({
  storage: createStorage('banners'),
  fileFilter,
  limits: { fileSize: config.upload.maxFileSize },
});

export const uploadLogoImage = multer({
  storage: createStorage('logos'),
  fileFilter,
  limits: { fileSize: config.upload.maxFileSize },
});
