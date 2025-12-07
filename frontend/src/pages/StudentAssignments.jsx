import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import { Download, File, Calendar, User, BookOpen } from 'lucide-react';

const StudentAssignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, overdue, completed

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      // In a real app, you'd filter by student's class and section
      // For now, we'll get all assignments
      const res = await axios.get('http://localhost:3000/api/assignments/student', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(res.data.assignments);
    } catch (err) {
      console.error('Error loading assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (assignment) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:3000/api/assignments/download/${assignment._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', assignment.fileName || 'assignment');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading file:', err);
      alert('Error downloading file');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const isPending = (dueDate) => {
    return new Date(dueDate) >= new Date();
  };

  const getFilteredAssignments = () => {
    switch (filter) {
      case 'pending':
        return assignments.filter(a => isPending(a.dueDate));
      case 'overdue':
        return assignments.filter(a => isOverdue(a.dueDate));
      default:
        return assignments;
    }
  };

  const filteredAssignments = getFilteredAssignments();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading assignments...</div>
      </div>
    );
  }

  return (
    <div className="text-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Assignments</h1>
          <p className="text-gray-600">View and download your assignments</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white border text-gray-700'
            }`}
          >
            All ({assignments.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'pending' ? 'bg-indigo-600 text-white' : 'bg-white border text-gray-700'
            }`}
          >
            Pending ({assignments.filter(a => isPending(a.dueDate)).length})
          </button>
          <button
            onClick={() => setFilter('overdue')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'overdue' ? 'bg-indigo-600 text-white' : 'bg-white border text-gray-700'
            }`}
          >
            Overdue ({assignments.filter(a => isOverdue(a.dueDate)).length})
          </button>
        </div>
      </div>

      {filteredAssignments.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No assignments found</h3>
          <p className="text-gray-600">
            {filter === 'all'
              ? "You don't have any assignments yet."
              : `No ${filter} assignments found.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAssignments.map((assignment) => (
            <div
              key={assignment._id}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold">{assignment.title}</h3>
                    <span className="px-3 py-1 text-sm rounded bg-indigo-100 text-indigo-800">
                      {assignment.subject}
                    </span>
                    {isOverdue(assignment.dueDate) && (
                      <span className="px-3 py-1 text-sm rounded bg-red-100 text-red-800">
                        Overdue
                      </span>
                    )}
                    {isPending(assignment.dueDate) && (
                      <span className="px-3 py-1 text-sm rounded bg-green-100 text-green-800">
                        Pending
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 mb-4">{assignment.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen size={16} />
                      <span>{assignment.class}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User size={16} />
                      <span>{assignment.teacherName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      <span>Due: {formatDate(assignment.dueDate)}</span>
                    </div>
                    {assignment.fileName && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <File size={16} />
                        <span>{assignment.fileName}</span>
                      </div>
                    )}
                  </div>

                  {assignment.fileUrl && (
                    <button
                      onClick={() => handleDownload(assignment)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Download size={18} />
                      Download Assignment
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentAssignments;

