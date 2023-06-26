const multer = require('multer');
const sharp = require('sharp')
const path = require('path')

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

const mimeTypes = Object.keys(MIME_TYPES);
const extensions = Object.values(MIME_TYPES);
const fileFilter = (req, file, callback) => {
  if (mimeTypes.includes(file.mimetype) && extensions.includes(path.extname(file.originalname).toLowerCase())) {
    callback(null, true);
  } else {
    callback(new Error('Le fichier doit être une image.'), false);
  }
};

const storage = multer.memoryStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const nameWithoutExtension = path.parse(file.originalname).name;
    const name = nameWithoutExtension.split(' ').join('_');
    callback(null, name + Date.now() + '.webp');
  }
});

const multerOptions = {
  storage: storage,
  fileFilter: fileFilter
};

module.exports = (req, res, next) => {
  const middlewareMulter = multer({ multerOptions }).single('image');

  middlewareMulter(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (req.file === undefined) {
      return next();
    }

    const buffer = req.file.buffer;
    const outputPath = path.join(__dirname, '..', 'images', path.parse(req.file.originalname).name.split(' ').join('_') + Date.now() + '.webp');
    sharp(buffer)
      .rotate()
      .resize(null, 600)
      .webp({ quality: 20 })
      .toFile(outputPath)
      .then(() => {
        req.file.originalname = path.basename(outputPath);
        next();
      })
      .catch(error => {
        next(error);
      });
  });
};
