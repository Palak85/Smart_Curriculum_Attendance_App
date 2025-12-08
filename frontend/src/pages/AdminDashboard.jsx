import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import axios from 'axios'
import { Users, UserCheck, BookOpen, Settings } from 'lucide-react'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const [studentsRes, teachersRes, classesRes] = await Promise.all([
        axios.get('http://localhost:3000/api/students'),
        axios.get('http://localhost:3000/api/teachers'),
        axios.get('http://localhost:3000/api/classes')
      ])

      setStats({
        totalStudents: studentsRes.data.students?.length || 0,
        totalTeachers: teachersRes.data.teachers?.length || 0,
        totalClasses: classesRes.data.classes?.length || 0
      })
    } catch (err) {
      console.error('Error loading stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddStudent = () => {
    navigate('/student')
  }

  const handleAddTeacher = () => {
    navigate('/teacher')
  }

  const handleManageClasses = () => {
    navigate('/classes')
  }

  return (
    <div className="text-gray-800">
      {/* Welcome Section */}
      <section className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name || 'Admin'}!</h1>
        <p className="text-gray-600">Manage your school system from here</p>
      </section>

      {/* KPI CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500 mb-1">Total Students</div>
              <div className="text-3xl font-semibold">
                {loading ? '...' : stats.totalStudents}
              </div>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500 mb-1">Total Teachers</div>
              <div className="text-3xl font-semibold">
                {loading ? '...' : stats.totalTeachers}
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500 mb-1">Total Classes</div>
              <div className="text-3xl font-semibold">
                {loading ? '...' : stats.totalClasses}
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={handleAddStudent}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Manage Students</h3>
              <p className="text-sm text-gray-600">Add, edit, or remove students</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={handleAddTeacher}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck size={24} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Manage Teachers</h3>
              <p className="text-sm text-gray-600">Add, edit, or remove teachers</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={handleManageClasses}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Manage Classes</h3>
              <p className="text-sm text-gray-600">Create classes and sections</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
