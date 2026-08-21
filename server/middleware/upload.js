const multer = require("multer");
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const ALLOWED_AUDIO_TYPES = [".mp3", ".wav", ".ogg", ".m4a"];
const ALLOWED_IMAGE_TYPES = [".jpg", ".jpeg", ".png", ".webp"];

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (file.fieldname === "audio") {
      if (!ALLOWED_AUDIO_TYPES.includes(ext)) {
        throw new Error(
          `Invalid audio type. Allowed: ${ALLOWED_AUDIO_TYPES.join(", ")}`
        );
      }

      return {
        folder: "dimusic/audio",
        resource_type: "video",
        public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
      };
    }

    if (file.fieldname === "image") {
      if (!ALLOWED_IMAGE_TYPES.includes(ext)) {
        throw new Error(
          `Invalid image type. Allowed: ${ALLOWED_IMAGE_TYPES.join(", ")}`
        );
      }

      return {
        folder: "dimusic/images",
        resource_type: "image",
        public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
      };
    }

    throw new Error("Unknown upload field");
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (file.fieldname === "audio") {
    if (!ALLOWED_AUDIO_TYPES.includes(ext)) {
      return cb(
        new Error(
          `Invalid audio type. Allowed: ${ALLOWED_AUDIO_TYPES.join(", ")}`
        ),
        false
      );
    }

    return cb(null, true);
  }

  if (file.fieldname === "image") {
    if (!ALLOWED_IMAGE_TYPES.includes(ext)) {
      return cb(
        new Error(
          `Invalid image type. Allowed: ${ALLOWED_IMAGE_TYPES.join(", ")}`
        ),
        false
      );
    }

    return cb(null, true);
  }

  cb(new Error("Unknown upload field"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

module.exports = upload;