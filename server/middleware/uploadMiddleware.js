import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/assignments');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter - allow PPT, PPTX, PDF, DOC, DOCX, etc.
const fileFilter = (req, file, cb) => {
  const allowedTypes = /\.(ppt|pptx|pdf|doc|docx|xls|xlsx|txt)$/i;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  // More permissive mimetype check - check extension first
  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PPT, PPTX, PDF, DOC, DOCX, XLS, XLSX, TXT files are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

export default upload;

