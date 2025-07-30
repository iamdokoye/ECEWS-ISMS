const ImageService = require('../config/multerConfig');

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    const imageData = {
      studentId: req.user.id,
      file: req.file,
      isProfile: req.body.isProfile === 'true'
    };

    const result = await ImageService.saveImageRecord(imageData.studentId, imageData.file);

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

exports.getImage = async (req, res, next) => {
  try {
    const image = await ImageService.getImage(
      req.params.imageId,
      req.user.id
    );

    res.set('Content-Type', image.mimeType);
    res.sendFile(image.filePath);
  } catch (error) {
    console.error('Image serve error:', error);
    res.status(404).json({ error: 'Image not found' });
    next(error);
  }
};