import express from 'express';
import {
  createAssignment,
  getTeacherAssignments,
  getStudentAssignments,
  getAssignment,
  updateAssignment,
  deleteAssignment,
  downloadAssignment
} from '../controllers/assignmentController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Teacher routes (require authentication)
router.post('/create', authMiddleware, upload.single('file'), createAssignment);
router.get('/teacher', authMiddleware, getTeacherAssignments);
router.get('/teacher/:id', authMiddleware, getAssignment);
router.put('/teacher/:id', authMiddleware, upload.single('file'), updateAssignment);
router.delete('/teacher/:id', authMiddleware, deleteAssignment);

// Student routes (require authentication)
router.get('/student', authMiddleware, getStudentAssignments);
router.get('/student/:id', authMiddleware, getAssignment);
router.get('/download/:id', authMiddleware, downloadAssignment);

export default router;

