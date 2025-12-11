import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { BookOpen, Award } from 'lucide-react'

const StudentGrades = () => {
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadGrades = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get('http://localhost:3000/api/grades/student', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setGrades(res.data.grades || [])
      } catch (err) {
        console.error('Load student grades error', err)
      } finally {
        setLoading(false)
      }
    }
    loadGrades()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading grades...
      </div>
    )
  }

  return (
    <div className="text-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">My Grades</h1>
          <p className="text-gray-600">See all your assessments and scores</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm">
          <Award size={20} className="text-indigo-600" />
          <span className="font-semibold">{grades.length} records</span>
        </div>
      </div>

      {grades.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
          No grades available yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {grades.map((g) => (
            <div key={g._id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-lg">{g.subject}</div>
                <span className="text-sm text-gray-500">{g.date}</span>
              </div>
              <div className="text-sm text-gray-600">{g.assessment}</div>
              <div className="flex items-center gap-3 mt-2 text-sm">
                <span className="px-2 py-1 rounded bg-indigo-100 text-indigo-700">
                  {g.score}/{g.total}
                </span>
                <span className="px-2 py-1 rounded bg-green-100 text-green-700">
                  Grade: {g.grade}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {g.class}-{g.section}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Teacher: {g.teacherName}
              </div>
              {g.remarks && <div className="text-sm text-gray-600 mt-1">Remarks: {g.remarks}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StudentGrades

