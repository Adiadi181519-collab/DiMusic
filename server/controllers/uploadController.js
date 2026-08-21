// @route POST /api/upload/audio
const uploadAudio = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No audio file uploaded' });
  }
  const fileUrl = `/uploads/audio/${req.file.filename}`;
  res.status(201).json({
    success: true,
    message: 'Audio uploaded successfully',
    data: { url: fileUrl, filename: req.file.filename, size: req.file.size }
  });
};

// @route POST /api/upload/image
const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file uploaded' });
  }
  const fileUrl = `/uploads/images/${req.file.filename}`;
  res.status(201).json({
    success: true,
    message: 'Image uploaded successfully',
    data: { url: fileUrl, filename: req.file.filename, size: req.file.size }
  });
};

module.exports = { uploadAudio, uploadImage };
