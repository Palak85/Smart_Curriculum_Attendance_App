import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'

const TeacherDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const myClasses = [
    { id: 'C1', name: 'Class 5-A', subject: 'Mathematics', students: 32 },
    { id: 'C2', name: 'Class 6-B', subject: 'Science', students: 28 },
    { id: 'C3', name: 'Class 4-C', subject: 'English', students: 30 }
  ]

  const todaySchedule = [
    { time: '09:00 AM', class: '5-A', subject: 'Mathematics' },
    { time: '10:30 AM', class: '6-B', subject: 'Science' },
    { time: '02:00 PM', class: '4-C', subject: 'English' }
  ]

  const recentAttendance = [
    { id: 'S1001', name: 'Aanya Sharma', class: '5-A', status: 'Present' },
    { id: 'S1002', name: 'Rohan Verma', class: '5-A', status: 'Absent' },
    { id: 'S1003', name: 'Maya Gupta', class: '6-B', status: 'Present' },
    { id: 'S1004', name: 'Arjun Singh', class: '6-B', status: 'Present' }
  ]

  return (
    <div className="text-gray-800">
      {/* Welcome Section */}
      <section className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name || 'Teacher'}!</h1>
        <p className="text-gray-600">Here's your teaching overview for today</p>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500">My Classes</div>
          <div className="text-2xl font-semibold mt-2">{myClasses.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500">Total Students</div>
          <div className="text-2xl font-semibold mt-2">
            {myClasses.reduce((sum, cls) => sum + cls.students, 0)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500">Today's Classes</div>
          <div className="text-2xl font-semibold mt-2">{todaySchedule.length}</div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            {todaySchedule.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{item.time}</div>
                  <div className="text-sm text-gray-600">{item.class} - {item.subject}</div>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded text-sm">
                  View Class
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="flex flex-col gap-2">
            <button className="py-2 px-3 rounded bg-indigo-600 text-white">
              Mark Attendance
            </button>
            <button className="py-2 px-3 rounded border">
              Add Assignment
            </button>
            <button className="py-2 px-3 rounded border">
              View Grades
            </button>
            <button className="py-2 px-3 rounded border">
              My Classes
            </button>
          </div>
        </div>
      </section>

      {/* My Classes */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-4">My Classes</h3>
          <div className="space-y-3">
            {myClasses.map((cls) => (
              <div key={cls.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{cls.name}</div>
                  <div className="text-sm text-gray-600">{cls.subject} • {cls.students} students</div>
                </div>
                <button 
                  className="px-4 py-2 bg-indigo-600 text-white rounded text-sm"
                  onClick={() => navigate(`/teacher/class/${cls.id}`)}
                >
                  Manage
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Attendance */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-4">Recent Attendance</h3>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2">ID</th>
                <th className="py-2">Name</th>
                <th className="py-2">Class</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAttendance.map((student) => (
                <tr key={student.id} className="border-t">
                  <td className="py-2">{student.id}</td>
                  <td className="py-2">{student.name}</td>
                  <td className="py-2">{student.class}</td>
                  <td className={`py-2 font-medium ${student.status === 'Present' ? 'text-green-600' : 'text-red-600'}`}>
                    {student.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default TeacherDashboard

