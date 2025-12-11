import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/authContext'
import { BookOpen, CheckCircle, GraduationCap } from 'lucide-react'

const TeacherGrades = () => {
  const { user } = useAuth()
  const [classes, setClasses] = useState([])
  const [sections, setSections] = useState([])
  const [students, setStudents] = useState([])
  const [grades, setGrades] = useState([])
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [saving, setSaving] = useState(false)
  const [filters, setFilters] = useState({ class: '', section: '' })
  const [form, setForm] = useState({
    studentId: '',
    subject: '',
    assessment: '',
    score: '',
    total: '',
    grade: '',
    remarks: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadClasses()
    loadGrades()
  }, [])

  useEffect(() => {
    if (filters.class) {
      const cls = classes.find(c => c.className === filters.class)
      setSections(cls ? cls.sections : [])
    } else {
      setSections([])
    }
  }, [filters.class, classes])

  const loadClasses = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/classes')
      setClasses(res.data.classes || [])
    } catch (err) {
      console.error('Load classes error', err)
    }
  }

  const loadStudents = async () => {
    if (!filters.class || !filters.section) {
      setMessage('Select class and section')
      return
    }
    try {
      setLoadingStudents(true)
      const res = await axios.get('http://localhost:3000/api/students')
      const list = (res.data.students || []).filter(
        s => s.class === filters.class && s.section === filters.section
      )
      setStudents(list)
      setMessage('')
    } catch (err) {
      console.error('Load students error', err)
      setMessage('Failed to load students')
    } finally {
      setLoadingStudents(false)
    }
  }

  const loadGrades = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('http://localhost:3000/api/grades/teacher', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setGrades(res.data.grades || [])
    } catch (err) {
      console.error('Load grades error', err)
    }
  }

  const handleSave = async () => {
    if (!form.studentId || !form.subject || !form.assessment || !form.score || !form.total || !form.grade || !form.date) {
      setMessage('All fields are required')
      return
    }
    try {
      setSaving(true)
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:3000/api/grades', form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage('Grade saved')
      setForm({
        studentId: '',
        subject: '',
        assessment: '',
        score: '',
        total: '',
        grade: '',
        remarks: '',
        date: new Date().toISOString().split('T')[0]
      })
      loadGrades()
    } catch (err) {
      console.error('Save grade error', err)
      setMessage(err.response?.data?.message || 'Failed to save grade')
    } finally {
      setSaving(false)
    }
  }

  const filteredGrades = grades.filter(g => {
    const matchesClass = filters.class ? g.class === filters.class : true
    const matchesSection = filters.section ? g.section === filters.section : true
    return matchesClass && matchesSection
  })

  return (
    <div className="text-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Grades</h1>
          <p className="text-gray-600">Assign grades to students by class and section</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm">
          <GraduationCap size={20} className="text-indigo-600" />
          <span className="font-semibold">{filteredGrades.length} records</span>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Class</label>
          <select
            className="w-full p-2 border rounded-lg"
            value={filters.class}
            onChange={(e) => setFilters({ ...filters, class: e.target.value, section: '' })}
          >
            <option value="">Select Class</option>
            {classes.map(c => (
              <option key={c._id} value={c.className}>{c.className}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Section</label>
          <select
            className="w-full p-2 border rounded-lg"
            value={filters.section}
            onChange={(e) => setFilters({ ...filters, section: e.target.value })}
            disabled={!filters.class}
          >
            <option value="">Select Section</option>
            {sections.map(sec => (
              <option key={sec} value={sec}>{sec}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={loadStudents}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          >
            Load Students
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-4 px-4 py-3 rounded bg-yellow-100 text-yellow-800 border border-yellow-200">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Form */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-3">Add Grade</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Student</label>
              <select
                className="w-full p-2 border rounded-lg"
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
              >
                <option value="">Select Student</option>
                {students.map(s => (
                  <option key={s._id} value={s._id}>
                    {s.name} — {s.roll} ({s.class}-{s.section})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  className="w-full p-2 border rounded-lg"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Assessment</label>
                <input
                  className="w-full p-2 border rounded-lg"
                  placeholder="Midterm, Unit Test..."
                  value={form.assessment}
                  onChange={(e) => setForm({ ...form, assessment: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Score</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg"
                  value={form.score}
                  onChange={(e) => setForm({ ...form, score: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Total</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg"
                  value={form.total}
                  onChange={(e) => setForm({ ...form, total: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Grade</label>
                <input
                  className="w-full p-2 border rounded-lg"
                  value={form.grade}
                  onChange={(e) => setForm({ ...form, grade: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-lg"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Remarks</label>
                <input
                  className="w-full p-2 border rounded-lg"
                  value={form.remarks}
                  onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Grade'}
            </button>
          </div>
        </div>

        {/* Grades List */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Recent Grades</h3>
            <span className="text-sm text-gray-500">{filteredGrades.length} items</span>
          </div>
          {filteredGrades.length === 0 ? (
            <div className="text-gray-500 text-center py-6">No grades found.</div>
          ) : (
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {filteredGrades.map(g => (
                <div key={g._id} className="p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{g.studentName} • {g.roll}</div>
                    <div className="text-sm text-gray-500">{g.date}</div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {g.class}-{g.section} • {g.subject} • {g.assessment}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm">
                    <span className="px-2 py-1 rounded bg-indigo-100 text-indigo-700">
                      {g.score}/{g.total}
                    </span>
                    <span className="px-2 py-1 rounded bg-green-100 text-green-700">
                      Grade: {g.grade}
                    </span>
                  </div>
                  {g.remarks && <div className="text-sm text-gray-600 mt-1">Remarks: {g.remarks}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TeacherGrades

