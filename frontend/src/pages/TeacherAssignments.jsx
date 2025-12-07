import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import { Upload, Download, Edit, Trash2, Plus, File } from 'lucide-react';

const TeacherAssignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    class: '',
    section: '',
    dueDate: ''
  });

  useEffect(() => {
    loadAssignments();
    loadClasses();
  }, []);

  const loadAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/api/assignments/teacher', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(res.data.assignments);
    } catch (err) {
      console.error('Error loading assignments:', err);
    }
  };

  const loadClasses = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/classes');
      setClasses(res.data.classes);
    } catch (err) {
      console.error('Error loading classes:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClassSelect = (e) => {
    const className = e.target.value;
    const selected = classes.find((c) => c.className === className);
    setFormData({ ...formData, class: className, section: '' });
    setSections(selected ? selected.sections : []);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.subject || !formData.class || !formData.section || !formData.dueDate) {
      alert('All fields are required!');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('class', formData.class);
      formDataToSend.append('section', formData.section);
      formDataToSend.append('dueDate', formData.dueDate);
      if (selectedFile) {
        formDataToSend.append('file', selectedFile);
      }

      if (editingAssignment) {
        await axios.put(`http://localhost:3000/api/assignments/teacher/${editingAssignment._id}`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.post('http://localhost:3000/api/assignments/create', formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      resetForm();
      loadAssignments();
      alert(editingAssignment ? 'Assignment updated successfully!' : 'Assignment created successfully!');
    } catch (err) {
      console.error('Error saving assignment:', err);
      alert(err.response?.data?.error || 'Error saving assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      subject: assignment.subject,
      class: assignment.class,
      section: assignment.section,
      dueDate: assignment.dueDate ? new Date(assignment.dueDate).toISOString().split('T')[0] : ''
    });
    const selected = classes.find((c) => c.className === assignment.class);
    setSections(selected ? selected.sections : []);
    setSelectedFile(null);
    setFilePreview(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/assignments/teacher/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadAssignments();
      alert('Assignment deleted successfully!');
    } catch (err) {
      console.error('Error deleting assignment:', err);
      alert('Error deleting assignment');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subject: '',
      class: '',
      section: '',
      dueDate: ''
    });
    setSelectedFile(null);
    setFilePreview(null);
    setEditingAssignment(null);
    setShowForm(false);
    setSections([]);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="text-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Assignments</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Create Assignment'}
        </button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Class *</label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleClassSelect}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map((c) => (
                    <option key={c._id} value={c.className}>
                      {c.className}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Section *</label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                  disabled={!formData.class}
                >
                  <option value="">Select Section</option>
                  {sections.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Due Date *</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Upload Document (PPT, PDF, DOC, etc.)</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <Upload size={20} />
                  Choose File
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".ppt,.pptx,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                    className="hidden"
                  />
                </label>
                {filePreview && (
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <File size={16} />
                    {filePreview}
                  </span>
                )}
                {editingAssignment?.fileName && !filePreview && (
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <File size={16} />
                    Current: {editingAssignment.fileName}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Max file size: 10MB</p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingAssignment ? 'Update Assignment' : 'Create Assignment'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Assignments List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">My Assignments ({assignments.length})</h2>
        </div>
        {assignments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No assignments created yet. Click "Create Assignment" to get started.
          </div>
        ) : (
          <div className="divide-y">
            {assignments.map((assignment) => (
              <div key={assignment._id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{assignment.title}</h3>
                      <span className="px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-800">
                        {assignment.subject}
                      </span>
                      {isOverdue(assignment.dueDate) && (
                        <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">
                          Overdue
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{assignment.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>Class: {assignment.class}</span>
                      <span>Section: {assignment.section}</span>
                      <span>Due: {formatDate(assignment.dueDate)}</span>
                      {assignment.fileName && (
                        <span className="flex items-center gap-1">
                          <File size={14} />
                          {assignment.fileName}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {assignment.fileUrl && (
                      <a
                        href={`http://localhost:3000${assignment.fileUrl}`}
                        download
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded"
                        title="Download"
                      >
                        <Download size={20} />
                      </a>
                    )}
                    <button
                      onClick={() => handleEdit(assignment)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(assignment._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAssignments;

