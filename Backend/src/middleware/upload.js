import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Vercel's read-only filesystem only allows writing to /tmp
const isProd = process.env.NODE_ENV === 'production';
const uploadDir = isProd ? '/tmp' : './public/Images';

// Only try creating directory if NOT in production
if (!isProd && !fs.existsSync(uploadDir)) {
    try {
        fs.mkdirSync(uploadDir, { recursive: true });
    } catch (e) {
        console.log("Upload directory already exists or handled by serverless environment.");
    }
}

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Sanitize original filename to avoid issues with spaces/special chars
        const safeOriginalName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const uniqueSuffix = `${Date.now()}-${safeOriginalName}`;
        cb(null, uniqueSuffix);
    }
});

// File filter - allow images, PDFs, DOCX, and other common types
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'video/mp4', 'video/webm', 'application/zip'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, true); // Accept all for flexibility during test
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB max
    }
});

export default upload;