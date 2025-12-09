import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Bell, Search, LogOut, Menu } from "lucide-react";
import { useAuth } from "../context/authContext";
import { useSchoolSettings } from "../context/SchoolSettingsContext";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { settings } = useSchoolSettings();   // ✅ YAHAN hook call karo

  const handleLogout = () => {
    logout();
    navigate("/login");
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

          <Link to="/admin-dashboard" className="block px-3 py-2 rounded hover:bg-indigo-50">
            Dashboard
          </Link>
          <Link to="/curriculum" className="block px-3 py-2 rounded hover:bg-indigo-50">
            Curriculum
          </Link>
          <Link to="/classes" className="block px-3 py-2 rounded hover:bg-indigo-50">
            Classes & Sections
          </Link>
          <Link to="/student" className="block px-3 py-2 rounded hover:bg-indigo-50">
            Students
          </Link>
          <Link to="/teacher" className="block px-3 py-2 rounded hover:bg-indigo-50">
            Teachers
          </Link>
          <Link to="/approve-leaves" className="block px-3 py-2 rounded hover:bg-indigo-50">
            Approve Leave
          </Link>
          <a className="block px-3 py-2 rounded hover:bg-indigo-50">Attendance</a>
          <Link to="/admin/settings" className="block px-3 py-2 rounded hover:bg-indigo-50">
            Settings
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
                {/* ✅ Yahan sirf TEXT render karo, object nahi */}
                <div className="font-semibold">
                  {settings?.schoolName || "Smart School"}
                </div>
                {/* <div className="text-xs text-gray-500">Admin Dashboard</div> */}
                <div className="text-xs text-gray-500">
                Admin Dashboard · {settings?.academicYear || "2024-25"}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE OF HEADER SAME AS BEFORE */}
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <input
                className="border rounded-lg px-3 py-2 w-64 text-sm"
                placeholder="Search students, teachers..."
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
                <div className="text-sm font-medium">{user?.name || "Admin"}</div>
                <div className="text-xs text-gray-500">
                  {user?.email || "admin@school.com"}
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
            </div>

            <button className="p-2 rounded hover:bg-gray-100" onClick={handleLogout}>
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* PAGE CONTENT + FOOTER */}
        <main className="p-6 flex-1">
          <Outlet />
        </main>

        {/* <footer className="mt-4 py-4 text-center text-xs text-gray-500 border-t bg-white">
          © {new Date().getFullYear()} {settings?.schoolName || "Smart School"} — All rights reserved
        </footer> */}
        {/* <footer className="mt-4 py-4 text-center text-xs text-gray-500 border-t bg-white">
          © {new Date().getFullYear()} {settings?.schoolName || "Smart School"} — All rights reserved
        </footer> */}

      <footer className="mt-4 py-4 text-center text-xs text-gray-600 border-t bg-white">
        <div className="font-semibold text-gray-700">
        © {new Date().getFullYear()} {settings?.schoolName || "Smart School"}
        </div>
        <div className="mt-1 text-gray-500">
          <b>Adress: </b> {settings?.address || "School Address"} • 
          <b>Email: </b>  {settings?.email || "info@school.com"} • 
          <b>Phone: </b>  {settings?.contactNumber || "+91-0000000000"}
        </div>
      </footer>

      </div>
    </div>
  );
}
