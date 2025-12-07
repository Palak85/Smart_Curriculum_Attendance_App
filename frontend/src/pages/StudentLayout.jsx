import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Bell, Search, LogOut, Menu, BookOpen, Users, Calendar, Award, User } from "lucide-react";
import { useAuth } from "../context/authContext";

export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex">
      {/* SIDEBAR */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } bg-white shadow-inner h-screen transition-all duration-300 overflow-hidden`}
      >
        <nav className="space-y-2 text-sm p-4">
          <div className="font-semibold px-2 py-1 text-gray-700">MAIN</div>

          <Link to="/student-dashboard" className="block px-3 py-2 rounded hover:bg-indigo-50 flex items-center gap-2">
            <BookOpen size={16} />
            Dashboard
          </Link>
          <Link to="/student/schedule" className="block px-3 py-2 rounded hover:bg-indigo-50 flex items-center gap-2">
            <Calendar size={16} />
            Class Schedule
          </Link>
          <Link to="/student/attendance" className="block px-3 py-2 rounded hover:bg-indigo-50 flex items-center gap-2">
            <Calendar size={16} />
            Attendance
          </Link>
          <Link to="/student/grades" className="block px-3 py-2 rounded hover:bg-indigo-50 flex items-center gap-2">
            <Award size={16} />
            Grades
          </Link>
          <Link to="/student/assignments" className="block px-3 py-2 rounded hover:bg-indigo-50 flex items-center gap-2">
            <BookOpen size={16} />
            Assignments
          </Link>
          <Link to="/student/profile" className="block px-3 py-2 rounded hover:bg-indigo-50 flex items-center gap-2">
            <User size={16} />
            My Profile
          </Link>
        </nav>
      </aside>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="flex items-center justify-between px-6 py-3 bg-white shadow-md">
          <div className="flex items-center gap-4">
            {/* Toggle sidebar */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded hover:bg-gray-100"
            >
              <Menu size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded flex items-center justify-center text-white font-bold">
                S
              </div>
              <div>
                <div className="font-semibold">Smart School</div>
                <div className="text-xs text-gray-500">Student Portal</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <input
                className="border rounded-lg px-3 py-2 w-64 text-sm"
                placeholder="Search assignments, grades..."
              />
              <div className="absolute right-2 top-2 text-gray-400">
                <Search size={14} />
              </div>
            </div>

            <button className="p-2 rounded hover:bg-gray-100 relative">
              <Bell size={18} />
              <span className="absolute -top-0.5 -right-0.5 text-xs bg-red-500 text-white rounded-full px-1">
                3
              </span>
            </button>

            <div className="flex items-center gap-3">
              <div className="text-right mr-2">
                <div className="text-sm font-medium">{user?.name || 'Student'}</div>
                <div className="text-xs text-gray-500">{user?.email || 'student@school.com'}</div>
              </div>
              <Link to="/student/profile">
              <div className="w-9 h-9 rounded-full bg-indigo-300 flex items-center justify-center">
                {user?.name?.charAt(0)?.toUpperCase() || 'S'}
              </div>
              </Link>
            </div>

            <button 
              className="p-2 rounded hover:bg-gray-100"
              onClick={handleLogout}
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* PAGE CONTENT + FOOTER */}
        <main className="p-6 flex-1">
          <Outlet />
        </main>

        {/* FOOTER */}
        <footer className="mt-4 py-4 text-center text-xs text-gray-500 border-t bg-white">
          © {new Date().getFullYear()} Smart School — Student Portal
        </footer>
      </div>
    </div>
  );
}

