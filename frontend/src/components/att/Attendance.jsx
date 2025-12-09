import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, CheckCircle, XCircle } from "lucide-react";

const Attendance = () => {
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ class: "", section: "" });
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (form.class) {
      const cls = classes.find((c) => c.className === form.class);
      setSections(cls ? cls.sections : []);
    } else {
      setSections([]);
    }
  }, [form.class, classes]);

  const loadClasses = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/classes");
      setClasses(res.data.classes || []);
    } catch (err) {
      console.error("Error loading classes", err);
    }
  };

  const loadStudents = async () => {
    if (!form.class || !form.section) {
      setMessage("Please select class and section");
      return;
    }
    try {
      setLoading(true);
      setMessage("");
      const res = await axios.get("http://localhost:3000/api/students");
      const filtered = (res.data.students || []).filter(
        (s) => s.class === form.class && s.section === form.section
      );
      setStudents(filtered);
      const defaultAttendance = {};
      filtered.forEach((s) => {
        defaultAttendance[s._id] = "Present";
      });
      setAttendance(defaultAttendance);
    } catch (err) {
      console.error("Error loading students", err);
      setMessage("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const setAll = (status) => {
    const updated = {};
    students.forEach((s) => {
      updated[s._id] = status;
    });
    setAttendance(updated);
  };

  const handleSubmit = async () => {
    if (!date || !form.class || !form.section) {
      setMessage("Please select date, class and section");
      return;
    }
    if (students.length === 0) {
      setMessage("No students found for selected class/section");
      return;
    }
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const records = students.map((s) => ({
        studentId: s._id,
        name: s.name,
        roll: s.roll,
        class: s.class,
        section: s.section,
        status: attendance[s._id] || "Absent",
      }));
      const res = await axios.post(
        "http://localhost:3000/api/attendance/mark",
        {
          date,
          class: form.class,
          section: form.section,
          records,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success) {
        setMessage("Attendance saved successfully");
      } else {
        setMessage(res.data.message || "Failed to save attendance");
      }
    } catch (err) {
      console.error("Save attendance error", err);
      setMessage("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Attendance</h1>
          <p className="text-gray-600">Fetch students and mark attendance</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm">
          <Users size={20} className="text-indigo-600" />
          <span className="font-semibold">{students.length} students</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded-lg"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Class</label>
          <select
            className="w-full p-2 border rounded-lg"
            value={form.class}
            onChange={(e) => setForm({ ...form, class: e.target.value, section: "" })}
          >
            <option value="">Select Class</option>
            {classes.map((c) => (
              <option key={c._id} value={c.className}>
                {c.className}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Section</label>
          <select
            className="w-full p-2 border rounded-lg"
            value={form.section}
            onChange={(e) => setForm({ ...form, section: e.target.value })}
            disabled={!form.class}
          >
            <option value="">Select Section</option>
            {sections.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={loadStudents}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          >
            Load Students
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-4 px-4 py-3 rounded bg-yellow-100 text-yellow-800 border border-yellow-200">
          {message}
        </div>
      )}

      {loading ? (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
          Loading students...
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
          No students loaded. Select class & section and click Load Students.
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Students</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setAll("Present")}
                className="px-3 py-1 rounded bg-green-100 text-green-700 text-sm"
              >
                Mark All Present
              </button>
              <button
                onClick={() => setAll("Absent")}
                className="px-3 py-1 rounded bg-red-100 text-red-700 text-sm"
              >
                Mark All Absent
              </button>
            </div>
          </div>

          <div className="divide-y">
            {students.map((s) => (
              <div key={s._id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-sm text-gray-500">
                    Roll: {s.roll} · Class: {s.class}-{s.section}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => markAttendance(s._id, "Present")}
                    className={`px-4 py-2 rounded flex items-center gap-2 ${
                      attendance[s._id] === "Present"
                        ? "bg-green-600 text-white"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    <CheckCircle size={16} />
                    Present
                  </button>
                  <button
                    onClick={() => markAttendance(s._id, "Absent")}
                    className={`px-4 py-2 rounded flex items-center gap-2 ${
                      attendance[s._id] === "Absent"
                        ? "bg-red-600 text-white"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    <XCircle size={16} />
                    Absent
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
