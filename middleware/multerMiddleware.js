const multer = require('multer');
const path = require('path');

// Set storage engine for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // The folder where the files should be saved
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // unique filename
    }
});

// Multer upload instance
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 } // Limit files to 5MB
});

