// @route POST /api/upload/audio
const uploadAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No audio file uploaded",
      });
    }

    // Cloudinary permanent URL
    const fileUrl = req.file.path;

    res.status(201).json({
      success: true,
      message: "Audio uploaded successfully",
      data: {
        url: fileUrl,
        filename: req.file.filename,
        size: req.file.size,
      },
    });
  } catch (error) {
    console.error("Audio upload error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to upload audio",
      error: error.message,
    });
  }
};


// @route POST /api/upload/image
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded",
      });
    }

    // Cloudinary permanent URL
    const fileUrl = req.file.path;

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: fileUrl,
        filename: req.file.filename,
        size: req.file.size,
      },
    });
  } catch (error) {
    console.error("Image upload error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to upload image",
      error: error.message,
    });
  }
};


module.exports = {
  uploadAudio,
  uploadImage,
};