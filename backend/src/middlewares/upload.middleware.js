const multer = require('multer');
const path = require('path');
const { generateId } = require('../utils/uuid.util');
const AppError = require('../utils/AppError');
const env = require('../config/env');

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', '..', env.upload.dir)),
  filename: (req, file, cb) => cb(null, `${generateId()}${path.extname(file.originalname)}`),
});

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return cb(new AppError('Only JPEG, PNG, and WEBP images are allowed.', 400, 'VALIDATION_ERROR'));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.upload.maxFileSizeMb * 1024 * 1024, files: env.upload.maxPhotosPerListing },
});

function uploadListingPhotos(req, res, next) {
  upload.array('photos', env.upload.maxPhotosPerListing)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new AppError(`Each photo must be smaller than ${env.upload.maxFileSizeMb}MB.`, 400, 'VALIDATION_ERROR'));
      }
      return next(
        new AppError(`You can upload up to ${env.upload.maxPhotosPerListing} photos at a time.`, 400, 'VALIDATION_ERROR'),
      );
    }
    if (err) return next(err);
    next();
  });
}

module.exports = { uploadListingPhotos };
