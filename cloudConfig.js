const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "staynest/listings",
    resource_type: "image",
    allowed_formats: ["png", "jpg", "jpeg", "webp"],
  },
});

const imageMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const imageUploadOptions = {
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 5 },
  fileFilter: (req, file, callback) => {
    if (imageMimeTypes.has(file.mimetype)) return callback(null, true);
    callback(new Error("Only JPEG, PNG, and WebP images are allowed."));
  },
};


module.exports = {
  cloudinary,
  storage,
  imageUploadOptions,
}
