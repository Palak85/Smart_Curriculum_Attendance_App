import Assignment from '../models/Assignment.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create assignment
export const createAssignment = async (req, res) => {
  try {
    const { title, description, subject, class: className, section, dueDate } = req.body;
    const teacherId = req.user._id;
    const teacherName = req.user.name;

    let fileUrl = null;
    let fileName = null;
    let fileSize = null;

    if (req.file) {
      fileUrl = `/uploads/assignments/${req.file.filename}`;
      fileName = req.file.originalname;
      fileSize = req.file.size;
    }

    const assignment = new Assignment({
      title,
      description,
      subject,
      class: className,
      section,
      dueDate: new Date(dueDate),
      teacherId,
      teacherName,
      fileUrl,
      fileName,
      fileSize
    });

    await assignment.save();
    res.status(201).json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all assignments (for teachers - their assignments)
export const getTeacherAssignments = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const assignments = await Assignment.find({ teacherId }).sort({ createdAt: -1 });
    res.json({ success: true, assignments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get assignments for students (filtered by class and section)
export const getStudentAssignments = async (req, res) => {
  try {
    // In a real app, you'd get student's class and section from their profile
    // For now, we'll return all assignments or filter by query params
    const { class: className, section } = req.query;
    
    let query = {};
    if (className) query.class = className;
    if (section) query.section = section;

    const assignments = await Assignment.find(query).sort({ createdAt: -1 });
    res.json({ success: true, assignments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single assignment
export const getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, error: 'Assignment not found' });
    }
    res.json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update assignment
export const updateAssignment = async (req, res) => {
  try {
    const { title, description, subject, class: className, section, dueDate } = req.body;
    const teacherId = req.user._id;

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, error: 'Assignment not found' });
    }

    // Check if teacher owns this assignment
    if (assignment.teacherId.toString() !== teacherId.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    // Handle file update
    let fileUrl = assignment.fileUrl;
    let fileName = assignment.fileName;
    let fileSize = assignment.fileSize;

    if (req.file) {
      // Delete old file if exists
      if (assignment.fileUrl) {
        const oldFilePath = path.join(__dirname, '..', assignment.fileUrl);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      fileUrl = `/uploads/assignments/${req.file.filename}`;
      fileName = req.file.originalname;
      fileSize = req.file.size;
    }

    assignment.title = title || assignment.title;
    assignment.description = description || assignment.description;
    assignment.subject = subject || assignment.subject;
    assignment.class = className || assignment.class;
    assignment.section = section || assignment.section;
    assignment.dueDate = dueDate ? new Date(dueDate) : assignment.dueDate;
    assignment.fileUrl = fileUrl;
    assignment.fileName = fileName;
    assignment.fileSize = fileSize;
    assignment.updatedAt = Date.now();

    await assignment.save();
    res.json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete assignment
export const deleteAssignment = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ success: false, error: 'Assignment not found' });
    }

    // Check if teacher owns this assignment
    if (assignment.teacherId.toString() !== teacherId.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    // Delete file if exists
    if (assignment.fileUrl) {
      const filePath = path.join(__dirname, '..', assignment.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Download assignment file
export const downloadAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment || !assignment.fileUrl) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }

    const filePath = path.join(__dirname, '..', assignment.fileUrl);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'File not found on server' });
    }

    res.download(filePath, assignment.fileName || 'assignment', (err) => {
      if (err) {
        res.status(500).json({ success: false, error: 'Error downloading file' });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

