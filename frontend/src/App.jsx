import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from "./pages/Login";
import AdminLayout from "./pages/AdminLayout";
import TeacherLayout from "./pages/TeacherLayout";
import StudentLayout from "./pages/StudentLayout";

import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import TeachersPage from './pages/TeachersPage';
import ClassesSections from './pages/ClassesSections';
import Students from './pages/Students';
import Curriculum from './pages/Curriculum';
import TeacherAssignments from './pages/TeacherAssignments';
import StudentAssignments from './pages/StudentAssignments';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login (outside layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />

        {/* ALL ADMIN PAGES THAT SHARE SIDEBAR */}
        <Route element={<AdminLayout />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/teacher" element={<TeachersPage />} />
          <Route path="/classes" element={<ClassesSections />} />
          <Route path="/student" element={<Students />} />
          <Route path="/curriculum" element={<Curriculum />} />
        </Route>

        {/* ALL TEACHER PAGES THAT SHARE TEACHER LAYOUT */}
        <Route element={<TeacherLayout />}>
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/classes" element={<div className="p-6"><h2 className="text-2xl font-bold">My Classes</h2></div>} />
          <Route path="/teacher/attendance" element={<div className="p-6"><h2 className="text-2xl font-bold">Attendance</h2></div>} />
          <Route path="/teacher/assignments" element={<TeacherAssignments />} />
          <Route path="/teacher/grades" element={<div className="p-6"><h2 className="text-2xl font-bold">Grades</h2></div>} />
        </Route>

        {/* ALL STUDENT/PARENT PAGES THAT SHARE STUDENT LAYOUT */}
        <Route element={<StudentLayout />}>
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student/schedule" element={<div className="p-6"><h2 className="text-2xl font-bold mb-4">Class Schedule</h2><p className="text-gray-600">Full weekly schedule will be displayed here</p></div>} />
          <Route path="/student/attendance" element={<div className="p-6"><h2 className="text-2xl font-bold mb-4">Attendance Records</h2><p className="text-gray-600">Detailed attendance history will be displayed here</p></div>} />
          <Route path="/student/grades" element={<div className="p-6"><h2 className="text-2xl font-bold mb-4">My Grades</h2><p className="text-gray-600">All grades and marks will be displayed here</p></div>} />
          <Route path="/student/assignments" element={<StudentAssignments />} />
          <Route path="/student/profile" element={<div className="p-6"><h2 className="text-2xl font-bold mb-4">My Profile</h2><p className="text-gray-600">Student profile information will be displayed here</p></div>} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App;
