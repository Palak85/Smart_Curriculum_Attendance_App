// src/pages/StudentAttendance.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StudentAttendance() {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      setMessage("");
      const token = localStorage.getItem("token"); // adjust if you store token differently

      const res = await axios.get("http://localhost:3000/api/attendance/student", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setStudent(res.data.student);
        setRecords(res.data.records || []);
      } else {
        setMessage(res.data.message || "Failed to fetch attendance");
      }
    } catch (err) {
      console.error("Fetch attendance error", err);
      setMessage(err.response?.data?.message || "Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  // compute stats
  const totalDays = records.length;
  const presentDays = records.filter(r => r.status === "Present").length;
  const absentDays = totalDays - presentDays;
  const percent = totalDays ? Math.round((presentDays / totalDays) * 100) : 0;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">My Attendance</h1>
          <p className="text-sm text-gray-500">Date-wise attendance records</p>
        </div>
      </div>

      {loading ? (
        <div className="p-6 bg-white rounded shadow text-center text-gray-500">Loading attendance...</div>
      ) : message ? (
        <div className="p-4 bg-yellow-50 text-yellow-700 rounded">{message}</div>
      ) : (
        <>
          <div className="bg-white p-4 rounded shadow mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Student</div>
              <div className="font-semibold">{student?.name} — Roll {student?.roll}</div>
              <div className="text-xs text-gray-400">{student?.class}-{student?.section}</div>
            </div>

            <div className="text-right">
              <div className="text-xs text-gray-500">Total Days</div>
              <div className="font-semibold text-lg">{totalDays}</div>
              <div className="text-xs text-gray-500 mt-1">Present: {presentDays} • Absent: {absentDays}</div>
              <div className="text-xs text-gray-500 mt-1">Attendance: {percent}%</div>
            </div>
          </div>

          <div className="bg-white rounded shadow">
            <div className="p-4 border-b">
              <strong className="text-sm">Records</strong>
            </div>

            <div className="divide-y">
              {records.length === 0 ? (
                <div className="p-4 text-gray-500">No attendance records yet.</div>
              ) : (
                records.map((r) => (
                  <div key={r.attendanceId} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{r.date}</div>
                      <div className="text-xs text-gray-500">Class: {r.class} · Section: {r.section}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1 rounded text-sm ${r.status === "Present" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {r.status}
                      </div>
                      <div className="text-xs text-gray-400">Marked: {new Date(r.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
