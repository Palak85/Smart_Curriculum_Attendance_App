import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import { Calendar, BookOpen, Award, Clock } from 'lucide-react'

const StudentDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Mock data - in real app, this would come from API
  const studentInfo = {
    name: user?.name || 'Student Name',
    roll: 'S1001',
    class: '5-A',
    section: 'A',
    email: user?.email || 'student@school.com'
  }

  const attendanceStats = {
    present: 85,
    absent: 5,
    total: 90,
    percentage: '94%'
  }

  const todaySchedule = [
    { time: '09:00 AM', subject: 'Mathematics', teacher: 'Mr. Sharma' },
    { time: '10:30 AM', subject: 'Science', teacher: 'Ms. Gupta' },
    { time: '12:00 PM', subject: 'English', teacher: 'Mrs. Patel' },
    { time: '02:00 PM', subject: 'Social Studies', teacher: 'Mr. Kumar' }
  ]

  const recentGrades = [
    { subject: 'Mathematics', assignment: 'Chapter 5 Test', grade: 'A', marks: '45/50' },
    { subject: 'Science', assignment: 'Lab Report', grade: 'B+', marks: '42/50' },
    { subject: 'English', assignment: 'Essay Writing', grade: 'A-', marks: '43/50' }
  ]

  const upcomingAssignments = [
    { subject: 'Mathematics', title: 'Chapter 6 Homework', dueDate: '2024-01-15', status: 'Pending' },
    { subject: 'Science', title: 'Project Submission', dueDate: '2024-01-18', status: 'In Progress' },
    { subject: 'English', title: 'Book Review', dueDate: '2024-01-20', status: 'Pending' }
  ]

  const announcements = [
    { title: 'School Holiday', date: '2024-01-12', message: 'School will be closed on Republic Day' },
    { title: 'Parent-Teacher Meeting', date: '2024-01-14', message: 'PTM scheduled for next week' },
    { title: 'Sports Day', date: '2024-01-16', message: 'Annual Sports Day registration open' }
  ]

  return (
    <div className="text-gray-800">
      {/* Welcome Section */}
      <section className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Welcome, {studentInfo.name}!</h1>
        <p className="text-gray-600">Here's your academic overview</p>
      </section>

      {/* Student Info Card */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500">Roll Number</div>
          <div className="text-2xl font-semibold mt-2">{studentInfo.roll}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500">Class & Section</div>
          <div className="text-2xl font-semibold mt-2">{studentInfo.class}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500">Attendance</div>
          <div className="text-2xl font-semibold mt-2">{attendanceStats.percentage}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500">Current GPA</div>
          <div className="text-2xl font-semibold mt-2">3.8</div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock size={18} />
              Today's Schedule
            </h3>
            <button 
              className="text-sm text-indigo-600 hover:underline"
              onClick={() => navigate('/student/schedule')}
            >
              View Full Schedule
            </button>
          </div>
          <div className="space-y-3">
            {todaySchedule.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-semibold">
                    {item.time.split(' ')[0]}
                  </div>
                  <div>
                    <div className="font-medium">{item.subject}</div>
                    <div className="text-sm text-gray-600">{item.teacher}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <div className="flex flex-col gap-2">
            <button 
              className="py-2 px-3 rounded bg-indigo-600 text-white text-left"
              onClick={() => navigate('/student/attendance')}
            >
              View Attendance
            </button>
            <button 
              className="py-2 px-3 rounded border text-left"
              onClick={() => navigate('/student/grades')}
            >
              My Grades
            </button>
            <button 
              className="py-2 px-3 rounded border text-left"
              onClick={() => navigate('/student/assignments')}
            >
              Assignments
            </button>
            <button 
              className="py-2 px-3 rounded border text-left"
              onClick={() => navigate('/student/profile')}
            >
              My Profile
            </button>
          </div>
        </div>
      </section>

      {/* Grades and Assignments */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Grades */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Award size={18} />
              Recent Grades
            </h3>
            <button 
              className="text-sm text-indigo-600 hover:underline"
              onClick={() => navigate('/student/grades')}
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentGrades.map((grade, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{grade.subject}</div>
                  <div className="text-sm text-gray-600">{grade.assignment}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-indigo-600">{grade.grade}</div>
                  <div className="text-sm text-gray-500">{grade.marks}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Assignments */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <BookOpen size={18} />
              Upcoming Assignments
            </h3>
            <button 
              className="text-sm text-indigo-600 hover:underline"
              onClick={() => navigate('/student/assignments')}
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {upcomingAssignments.map((assignment, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{assignment.subject}</div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    assignment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {assignment.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-1">{assignment.title}</div>
                <div className="text-xs text-gray-500">Due: {assignment.dueDate}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Attendance Details and Announcements */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Details */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-4">Attendance Overview</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Present</span>
                <span className="font-medium">{attendanceStats.present} days</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(attendanceStats.present / attendanceStats.total) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Absent</span>
                <span className="font-medium">{attendanceStats.absent} days</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full" 
                  style={{ width: `${(attendanceStats.absent / attendanceStats.total) * 100}%` }}
                ></div>
              </div>
            </div>
            <button 
              className="w-full py-2 px-3 rounded border hover:bg-gray-50"
              onClick={() => navigate('/student/attendance')}
            >
              View Detailed Attendance
            </button>
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar size={18} />
              Announcements
            </h3>
          </div>
          <div className="space-y-3">
            {announcements.map((announcement, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium text-sm">{announcement.title}</div>
                  <div className="text-xs text-gray-500">{announcement.date}</div>
                </div>
                <div className="text-sm text-gray-600">{announcement.message}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default StudentDashboard

