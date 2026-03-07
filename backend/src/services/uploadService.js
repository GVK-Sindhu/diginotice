const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const fileType = file.mimetype.split('/')[0]; // image or application (for pdf)
        const folder = fileType === 'image' ? 'noticehub/images' : 'noticehub/pdfs';

        return {
            folder: folder,
            resource_type: 'auto',
            public_id: path.parse(file.originalname).name + '-' + Date.now()
        };
    }
});

// Local Storage for fallback or if Cloudinary is not configured
const localDiskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const fileType = file.mimetype.split('/')[0];
        const uploadDir = fileType === 'image' ? 'uploads/images' : 'uploads/pdfs';
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Check file type
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG, PNG and PDF are allowed.'), false);
    }
};

const upload = multer({
    storage: process.env.CLOUDINARY_CLOUD_NAME ? storage : localDiskStorage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
});

module.exports = upload;
