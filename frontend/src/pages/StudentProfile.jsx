import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/authContext'
import { User, Mail, Phone, MapPin, Calendar, BookOpen, Award } from 'lucide-react'

const StudentProfile = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  // Mock data – real app me yahan API call karega
  useEffect(() => {
    // Example: API se fetch kar sakte ho:
    // axios.get('/api/student/profile', { headers: { Authorization: `Bearer ${token}` } })
    //   .then(res => setProfile(res.data))

    const mockProfile = {
      name: user?.name || 'Student Name',
      email: user?.email || 'student@school.com',
      rollNo: 'S1001',
      admissionNo: 'ADM-2024-015',
      className: '5',
      section: 'A',
      gender: 'Male',
      dob: '2014-03-15',
      bloodGroup: 'O+',
      phone: '9876543210',
      parentName: 'Mr. Raj Sharma',
      parentPhone: '9876500011',
      address: 'H.No. 123, Shastri Nagar, New Delhi',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110052',
      currentYear: '2024-25',
      house: 'Blue House',
      hobbies: 'Reading, Football, Drawing',
      emergencyContact: 'Uncle - 9876500022'
    }

    setTimeout(() => {
      setProfile(mockProfile)
      setLoading(false)
    }, 400)
  }, [user])

  const getInitials = (name) => {
    if (!name) return 'ST'
    const parts = name.split(' ')
    if (parts.length === 1) return parts[0][0]?.toUpperCase()
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 text-sm">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="text-gray-800">
      {/* Header */}
      <section className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">My Profile</h1>
          <p className="text-gray-600">View your personal and academic details</p>
        </div>
        <div className="flex items-center gap-3 bg-white rounded-xl shadow-sm px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-semibold">
            {getInitials(profile.name)}
          </div>
          <div className="text-sm">
            <div className="font-semibold">{profile.name}</div>
            <div className="text-gray-500 text-xs">Roll No: {profile.rollNo}</div>
          </div>
        </div>
      </section>

      {/* Top Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-xs text-gray-500 mb-1">Class & Section</div>
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-indigo-600" />
            <div className="text-lg font-semibold">
              {profile.className}-{profile.section}
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Academic Year: {profile.currentYear}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-xs text-gray-500 mb-1">Admission Number</div>
          <div className="text-lg font-semibold">{profile.admissionNo}</div>
          <div className="text-xs text-gray-500 mt-1">
            House: {profile.house}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-xs text-gray-500 mb-1">Date of Birth</div>
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-indigo-600" />
            <div className="text-lg font-semibold">{profile.dob}</div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Gender: {profile.gender}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-xs text-gray-500 mb-1">Blood Group</div>
          <div className="text-lg font-semibold">{profile.bloodGroup}</div>
          <div className="text-xs text-gray-500 mt-1">
            Emergency: {profile.emergencyContact}
          </div>
        </div>
      </section>

      {/* Main Content: Two Columns */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Personal Details */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <User size={18} className="text-indigo-600" />
            Personal Details
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-500 w-28">Full Name</span>
              <span className="font-medium flex-1">{profile.name}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500 w-28">Email</span>
              <span className="font-medium flex-1 flex items-center gap-2">
                <Mail size={14} className="text-gray-500" />
                {profile.email}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500 w-28">Phone</span>
              <span className="font-medium flex-1 flex items-center gap-2">
                <Phone size={14} className="text-gray-500" />
                {profile.phone}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500 w-28">Roll No</span>
              <span className="font-medium flex-1">{profile.rollNo}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500 w-28">Class</span>
              <span className="font-medium flex-1">
                {profile.className} &nbsp; (Section {profile.section})
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500 w-28">Hobbies</span>
              <span className="font-medium flex-1">{profile.hobbies}</span>
            </div>
          </div>
        </div>

        {/* Parent & Contact Details */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Phone size={18} className="text-indigo-600" />
            Parent / Guardian
          </h2>
          <div className="space-y-3 text-sm mb-4">
            <div className="flex justify-between gap-4">
              <span className="text-gray-500 w-32">Parent Name</span>
              <span className="font-medium flex-1">{profile.parentName}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500 w-32">Parent Phone</span>
              <span className="font-medium flex-1 flex items-center gap-2">
                <Phone size={14} className="text-gray-500" />
                {profile.parentPhone}
              </span>
            </div>
          </div>

          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <MapPin size={18} className="text-indigo-600" />
            Address
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-500 w-32">Address</span>
              <span className="font-medium flex-1">{profile.address}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500 w-32">City</span>
              <span className="font-medium flex-1">{profile.city}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500 w-32">State</span>
              <span className="font-medium flex-1">{profile.state}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500 w-32">Pincode</span>
              <span className="font-medium flex-1">{profile.pincode}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Summary (optional small section) */}
      <section className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Award size={18} className="text-indigo-600" />
          Academic Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-gray-500 text-xs mb-1">Current Status</div>
            <div className="font-medium">Active</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs mb-1">Overall Attendance</div>
            <div className="font-medium">94%</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs mb-1">Last Updated</div>
            <div className="font-medium">10 Jan 2025</div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default StudentProfile
