const multer = require('multer');
const path = require('path');
const fs = require('fs');

const AUDIO_DIR = path.join(__dirname, '..', 'uploads', 'audio');
const IMAGE_DIR = path.join(__dirname, '..', 'uploads', 'images');

[AUDIO_DIR, IMAGE_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const ALLOWED_AUDIO_TYPES = ['.mp3', '.wav', '.ogg', '.m4a'];
const ALLOWED_IMAGE_TYPES = ['.jpg', '.jpeg', '.png', '.webp'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'audio') return cb(null, AUDIO_DIR);
    if (file.fieldname === 'image') return cb(null, IMAGE_DIR);
    cb(new Error('Unknown upload field'), null);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (file.fieldname === 'audio') {
    if (!ALLOWED_AUDIO_TYPES.includes(ext)) {
      return cb(new Error(`Invalid audio type. Allowed: ${ALLOWED_AUDIO_TYPES.join(', ')}`), false);
    }
    return cb(null, true);
  }

  if (file.fieldname === 'image') {
    if (!ALLOWED_IMAGE_TYPES.includes(ext)) {
      return cb(new Error(`Invalid image type. Allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}`), false);
    }
    return cb(null, true);
  }

  cb(new Error('Unknown upload field'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

module.exports = upload;
