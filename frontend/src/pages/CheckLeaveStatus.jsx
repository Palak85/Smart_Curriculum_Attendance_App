import React, { useEffect, useState } from "react";
import axios from "axios";

const CheckLeaveStatus = () => {
  const [teacherId, setTeacherId] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState("");

  const fetchLeaves = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/leaves/my-leaves/${id}`);
      setLeaves(res.data.leaves);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error fetching leaves");
    }
  };

  useEffect(() => {
    // Set teacherId manually or from localStorage
    const id = localStorage.getItem("teacherId"); // optional
    if (id) {
      setTeacherId(id);
      fetchLeaves(id);
    }
  }, []);

  const handleFetch = () => {
    if (!teacherId) {
      setMessage("Please enter your Teacher ID");
      return;
    }
    fetchLeaves(teacherId);
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-semibold mb-4">Check Leave Status</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter your Teacher ID"
          className="border p-2 mr-2"
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
        />
        <button onClick={handleFetch} className="bg-blue-600 text-white px-4 py-2 rounded">
          Fetch Leaves
        </button>
      </div>

      {message && <p className="text-red-500 mb-4">{message}</p>}

      <table className="border border-gray-300 w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">From Date</th>
            <th className="p-2 border">To Date</th>
            <th className="p-2 border">Reason</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.length > 0 ? (
            leaves.map((leave) => (
              <tr key={leave._id}>
                <td className="p-2 border">{leave.fromDate}</td>
                <td className="p-2 border">{leave.toDate}</td>
                <td className="p-2 border">{leave.reason}</td>
                <td className="p-2 border">{leave.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center p-3 text-gray-500">
                No leaves found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CheckLeaveStatus;
