import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from "./pages/Login";
import AdminLayout from "./pages/AdminLayout";
import TeacherLayout from "./pages/TeacherLayout";

import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import TeachersPage from './pages/TeachersPage';
import ClassesSections from './pages/ClassesSections';
import Students from './pages/Students';
import Curriculum from './pages/Curriculum';

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
          <Route path="/teacher/assignments" element={<div className="p-6"><h2 className="text-2xl font-bold">Assignments</h2></div>} />
          <Route path="/teacher/grades" element={<div className="p-6"><h2 className="text-2xl font-bold">Grades</h2></div>} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App;
