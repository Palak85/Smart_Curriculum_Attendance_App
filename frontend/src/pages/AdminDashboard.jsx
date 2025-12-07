import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts'

const kpiData = [
  { id: 1, title: "Total Students", value: 1240 },
  { id: 2, title: "Total Teachers", value: 72 },
  { id: 3, title: "Today's Attendance", value: '92%' },
  { id: 4, title: "Ongoing Activities", value: 6 }
]

const attendanceSeries = [
  { day: 'Mon', attendance: 90 },
  { day: 'Tue', attendance: 92 },
  { day: 'Wed', attendance: 88 },
  { day: 'Thu', attendance: 94 },
  { day: 'Fri', attendance: 91 },
  { day: 'Sat', attendance: 85 }
]

const activitySeries = [
  { name: 'Sports', participants: 120 },
  { name: 'Arts', participants: 85 },
  { name: 'Music', participants: 60 },
  { name: 'Robotics', participants: 40 }
]

const recentStudents = [
  { id: 'S1001', name: 'Aanya Sharma', class: '5-A', attendance: 'Present' },
  { id: 'S1002', name: 'Rohan Verma', class: '6-B', attendance: 'Absent' },
  { id: 'S1003', name: 'Maya Gupta', class: '4-C', attendance: 'Present' },
  { id: 'S1004', name: 'Arjun Singh', class: '7-A', attendance: 'Present' }
]

export default function AdminDashboard() {
  const navigate = useNavigate()

  const handleAddStudent = () => {
    // change '/students' to whatever route your StudentsPage uses
    navigate('/student')
  }

  const handleAddTeacher = () => {
    // optional: navigate to teachers page
    navigate('/teacher')
  }

  return (
    <div className="text-gray-800">
      {/* KPI CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {kpiData.map(kpi => (
          <div key={kpi.id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">{kpi.title}</div>
            <div className="text-2xl font-semibold mt-2">{kpi.value}</div>
          </div>
        ))}
      </section>

      {/* CHARTS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Attendance Chart */}
        <div className="col-span-2 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Attendance (Weekly)</h3>
            <div className="text-sm text-gray-500">Last 7 days</div>
          </div>

          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <LineChart data={attendanceSeries}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="attendance" stroke="#6366F1" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Activity Participation</h3>
            <div className="text-sm text-gray-500">This month</div>
          </div>

          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={activitySeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="participants" barSize={20} fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* RECENT STUDENTS TABLE + QUICK ACTIONS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Student Attendance</h3>
            <div className="text-sm text-gray-500">Today</div>
          </div>

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
              {recentStudents.map(s => (
                <tr key={s.id} className="border-t">
                  <td className="py-2">{s.id}</td>
                  <td className="py-2">{s.name}</td>
                  <td className="py-2">{s.class}</td>
                  <td className={`py-2 font-medium ${s.attendance === 'Present' ? 'text-green-600' : 'text-red-600'}`}>
                    {s.attendance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="flex flex-col gap-2">
            <button
              className="py-2 px-3 rounded bg-indigo-600 text-white"
              onClick={handleAddStudent}
            >
              Add Student
            </button>

            <button
              className="py-2 px-3 rounded bg-indigo-600 text-white"
              onClick={handleAddTeacher}
            >
              Add Teacher
            </button>

            <button className="py-2 px-3 rounded border">Upload Curriculum</button>
            <button className="py-2 px-3 rounded border">Create Activity</button>
          </div>
        </div>
      </section>

      
    </div>
  )
}
