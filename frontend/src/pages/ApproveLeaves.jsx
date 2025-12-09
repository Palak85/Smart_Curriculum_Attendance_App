// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const ApproveLeaves = () => {
//   const [leaves, setLeaves] = useState([]);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     const fetchLeaves = async () => {
//       try {
//         const res = await axios.get("http://localhost:3000/api/leaves/all");
//         if (res.data.success) setLeaves(res.data.leaves);
//       } catch (error) {
//         console.log(error);
//         setMessage("❌ Error fetching leaves");
//       }
//     };

//     fetchLeaves();
//   }, []);

//   const formatDate = (date) => new Date(date).toLocaleDateString("en-IN");

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-semibold mb-4">Leaves</h2>

//       {message && <p className="text-red-600 mb-3">{message}</p>}

//       <table className="border border-gray-300 w-full">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="p-2 border">Teacher Name</th>
//             <th className="p-2 border">Teacher ID</th>
//             <th className="p-2 border">From</th>
//             <th className="p-2 border">To</th>
//             <th className="p-2 border">Reason</th>
//             <th className="p-2 border">Status</th>
//           </tr>
//         </thead>

//         <tbody>
//           {leaves.length > 0 ? (
//             leaves.map((leave) => (
//               <tr key={leave._id}>
//                 <td className="p-2 border">{leave.teacherName}</td>
//                 <td className="p-2 border">{leave.teacherId}</td>
//                 <td className="p-2 border">{formatDate(leave.fromDate)}</td>
//                 <td className="p-2 border">{formatDate(leave.toDate)}</td>
//                 <td className="p-2 border">{leave.reason}</td>
//                 <td className="p-2 border">{leave.status}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="6" className="text-center p-3 text-gray-500">
//                 No leaves found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ApproveLeaves;





import React, { useEffect, useState } from "react";
import axios from "axios";

const ApproveLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch all leaves
  const fetchLeaves = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/leaves/all");
      if (res.data.success) setLeaves(res.data.leaves);
    } catch (error) {
      console.log(error);
      setMessage("❌ Error fetching leaves");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Update status
  const updateStatus = async (id, status) => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/leaves/update/${id}`,
        { status }
      );

      if (res.data.success) {
        setMessage(`✔ ${res.data.message}`);
        fetchLeaves(); // refresh list
      }
    } catch (error) {
      console.log(error);
      setMessage("❌ Error updating leave");
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString("en-IN");

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Leaves</h2>

      {message && <p className="text-blue-600 mb-3">{message}</p>}

      <table className="border border-gray-300 w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Teacher Name</th>
            <th className="p-2 border">Teacher ID</th>
            <th className="p-2 border">From</th>
            <th className="p-2 border">To</th>
            <th className="p-2 border">Reason</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>

        <tbody>
          {leaves.length > 0 ? (
            leaves.map((leave) => (
              <tr key={leave._id}>
                <td className="p-2 border">{leave.teacherName}</td>
                <td className="p-2 border">{leave.teacherId}</td>
                <td className="p-2 border">{formatDate(leave.fromDate)}</td>
                <td className="p-2 border">{formatDate(leave.toDate)}</td>
                <td className="p-2 border">{leave.reason}</td>
                <td className="p-2 border font-semibold">{leave.status}</td>

                <td className="p-2 border flex gap-2">
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded"
                    disabled={leave.status === "Approved"}
                    onClick={() => updateStatus(leave._id, "Approved")}
                  >
                    Approve
                  </button>

                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded"
                    disabled={leave.status === "Rejected"}
                    onClick={() => updateStatus(leave._id, "Rejected")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center p-3 text-gray-500">
                No leaves found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApproveLeaves;
