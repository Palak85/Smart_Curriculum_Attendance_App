import React, { useState } from "react";
import axios from "axios";

const Attendance = () => {
  const [date, setDate] = useState("");
  const [attendance, setAttendance] = useState({});
  const [message, setMessage] = useState("");

  // Example students list (replace with DB later if needed)
  const students = [
    { id: "1", name: "Aman Sharma" },
    { id: "2", name: "Priya Singh" },
    { id: "3", name: "Rohit Verma" },
  ];

  // Mark attendance in local state
  const markAttendance = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // Save attendance to backend
  const handleSubmit = async () => {
    if (!date) {
      setMessage("⚠ Please select a date");
      return;
    }

    if (Object.keys(attendance).length === 0) {
      setMessage("⚠ Please mark attendance for at least one student");
      return;
    }

    const records = students.map((student) => ({
      studentId: student.id,
      name: student.name,
      status: attendance[student.id] || "Absent", // Default Absent
    }));

    try {
      const response = await axios.post("http://localhost:3000/api/attendance/save", {
        date,
        records,
      });

      if (response.data.success) {
        setMessage("✅ Attendance saved successfully!");
        alert("Attendance Marked ")
      } else {
        setMessage("⚠ " + response.data.message);
      }
    } catch (error) {
      setMessage("❌ Server error while saving attendance");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Mark Attendance</h1>

      {/* DATE SELECTOR */}
      <div className="mb-6">
        <label className="block mb-2 text-lg font-semibold">Select Date:</label>
        <input
          type="date"
          className="px-3 py-2 border rounded w-60"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* MESSAGE */}
      {message && (
        <p className="mb-4 text-center font-semibold text-red-600">{message}</p>
      )}

      {/* STUDENTS LIST */}
      <div className="bg-white p-4 rounded shadow-md">
        {students.map((student) => (
          <div
            key={student.id}
            className="flex justify-between p-3 border-b items-center"
          >
            <p className="text-lg">{student.name}</p>

            <div className="flex gap-3">
              <button
                onClick={() => markAttendance(student.id, "Present")}
                className={`px-4 py-1 rounded ${
                  attendance[student.id] === "Present"
                    ? "bg-green-500 text-white"
                    : "bg-green-200"
                }`}
              >
                Present
              </button>

              <button
                onClick={() => markAttendance(student.id, "Absent")}
                className={`px-4 py-1 rounded ${
                  attendance[student.id] === "Absent"
                    ? "bg-red-500 text-white"
                    : "bg-red-200"
                }`}
              >
                Absent
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SUBMIT */}
      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded"
      >
        Submit Attendance
      </button>
    </div>
  );
};

export default Attendance;
