import React, { useState } from "react";
import axios from "axios";

const ApplyLeave = () => {
  const [teacherName, setTeacherName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teacherName || !teacherId || !fromDate || !toDate || !reason) {
      setMessage("All fields are required");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/leaves/apply", {
        teacherName,
        teacherId,
        fromDate,
        toDate,
        reason,
      });

      if (res.data.success) {
        setMessage("Leave applied successfully!");
        setTeacherName("");
        setTeacherId("");
        setFromDate("");
        setToDate("");
        setReason("");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="p-6 w-80">
      <h2 className="text-2xl font-semibold mb-4">Apply Leave</h2>
      {message && <p className="text-green-600 mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Teacher Name</label>
          <input
            type="text"
            className="w-full border p-2"
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label>Teacher ID</label>
          <input
            type="text"
            className="w-full border p-2"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            placeholder="Enter your ID"
            required
          />
        </div>

        <div>
          <label>From Date</label>
          <input
            type="date"
            className="w-full border p-2"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>To Date</label>
          <input
            type="date"
            className="w-full border p-2"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Reason</label>
          <textarea
            className="w-full border p-2"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          ></textarea>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Apply
        </button>
      </form>
    </div>
  );
};

export default ApplyLeave;



