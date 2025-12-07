// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Plus, Trash } from 'lucide-react';

// export default function ClassesSections() {
//   const [classes, setClasses] = useState([]);
//   const [newClass, setNewClass] = useState("");
//   const [newSection, setNewSection] = useState({});
//   const [loading, setLoading] = useState(false);

//   const API_URL = "http://localhost:3000/api/classes";

//   // Load classes from backend
//   const loadClasses = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(API_URL);
//       setClasses(res.data.classes);
//     } catch (err) {
//       console.error(err);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     loadClasses();
//   }, []);

//   // Add new class
//   const addClass = async () => {
//     if (!newClass.trim()) return;
//     try {
//       await axios.post(`${API_URL}/add`, { className: newClass });
//       setNewClass("");
//       loadClasses();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Add new section
//   const addSection = async (classId) => {
//     if (!newSection[classId]?.trim()) return;
//     try {
//       await axios.post(`${API_URL}/${classId}/section`, { section: newSection[classId] });
//       setNewSection({ ...newSection, [classId]: "" });
//       loadClasses();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Delete section
//   const deleteSection = async (classId, sectionName) => {
//     try {
//       await axios.delete(`${API_URL}/${classId}/section/${sectionName}`);
//       loadClasses();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Delete class
//   const deleteClass = async (classId) => {
//     try {
//       await axios.delete(`${API_URL}/${classId}`);
//       loadClasses();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h2 className="text-2xl font-bold mb-6">Classes & Sections</h2>

//       {/* Add Class */}
//       <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex gap-3">
//         <input
//           type="text"
//           placeholder="Enter Class Name (e.g. Class 4)"
//           className="border px-3 py-2 rounded w-full"
//           value={newClass}
//           onChange={(e) => setNewClass(e.target.value)}
//         />
//         <button
//           onClick={addClass}
//           className="bg-indigo-600 text-white px-4 rounded flex items-center gap-2"
//         >
//           <Plus size={18} /> Add
//         </button>
//       </div>

//       {loading ? (
//         <p>Loading classes...</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {classes.map((cls) => (
//             <div key={cls._id} className="bg-white p-4 rounded-lg shadow-sm">
//               <div className="flex justify-between items-center mb-3">
//                 <h3 className="text-lg font-semibold">{cls.className}</h3>
//                 <button
//                   onClick={() => deleteClass(cls._id)}
//                   className="text-red-500 hover:bg-red-50 p-2 rounded"
//                 >
//                   <Trash size={16} />
//                 </button>
//               </div>

//               {/* Sections */}
//               <div className="mb-3">
//                 <p className="text-sm text-gray-500 mb-2">Sections:</p>
//                 <div className="flex flex-wrap gap-2">
//                   {cls.sections.map(sec => (
//                     <div
//                       key={sec}
//                       className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm"
//                     >
//                       {sec}
//                       <button
//                         onClick={() => deleteSection(cls._id, sec)}
//                         className="text-red-500"
//                       >
//                         <Trash size={14} />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Add Section */}
//               <div className="flex gap-2 mt-3">
//                 <input
//                   type="text"
//                   placeholder="Add Section (e.g. D)"
//                   className="border px-3 py-1 rounded w-full"
//                   value={newSection[cls._id] || ""}
//                   onChange={(e) =>
//                     setNewSection({ ...newSection, [cls._id]: e.target.value })
//                   }
//                 />
//                 <button
//                   onClick={() => addSection(cls._id)}
//                   className="bg-green-600 text-white px-3 rounded"
//                 >
//                   <Plus size={16} />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash } from "lucide-react";

export default function ClassesSections() {
  const [classes, setClasses] = useState([]);

  const [newClass, setNewClass] = useState("");
  const [newSection, setNewSection] = useState("");
  const [activeClassId, setActiveClassId] = useState(null);

  // Load classes from backend
  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/classes");
      setClasses(res.data.classes);
    } catch (err) {
      console.error("Error loading classes:", err);
    }
  };

  const addClass = async () => {
    if (!newClass.trim()) return;

    try {
      await axios.post("http://localhost:3000/api/classes/add", {
        className: newClass,
      });

      setNewClass("");
      loadClasses();
    } catch (err) {
      console.error("Error adding class:", err);
    }
  };

  const addSection = async (classId) => {
    if (!newSection.trim()) return;

    try {
      await axios.post(`http://localhost:3000/api/classes/${classId}/section`, {
        section: newSection,
      });

      setNewSection("");
      setActiveClassId(null);
      loadClasses();
    } catch (err) {
      console.error("Error adding section:", err);
    }
  };

  const deleteSection = async (classId, section) => {
    try {
      await axios.delete(`http://localhost:3000/api/classes/${classId}/section/${section}`);


      loadClasses();
    } catch (err) {
      console.error("Error deleting section:", err);
    }
  };

  const deleteClass = async (classId) => {
    try {
      await axios.delete(`http://localhost:3000/api/classes/${classId}`);
      loadClasses();
    } catch (err) {
      console.error("Error deleting class:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Classes & Sections</h2>

      {/* Add Class */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex gap-3">
        <input
          type="text"
          placeholder="Enter Class Name (e.g. Class 4)"
          className="border px-3 py-2 rounded w-full"
          value={newClass}
          onChange={(e) => setNewClass(e.target.value)}
        />
        <button
          onClick={addClass}
          className="bg-indigo-600 text-white px-4 rounded flex items-center gap-2"
        >
          <Plus size={18} /> Add
        </button>
      </div>

      {/* Class List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls) => (
          <div key={cls._id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">{cls.className}</h3>

              <button
                onClick={() => deleteClass(cls._id)}
                className="text-red-500 hover:bg-red-50 p-2 rounded"
              >
                <Trash size={16} />
              </button>
            </div>

            {/* Existing Sections */}
            <div className="mb-3">
              <p className="text-sm text-gray-500 mb-2">Sections:</p>

              <div className="flex flex-wrap gap-2">
                {cls.sections.map((sec) => (
                  <div
                    key={sec}
                    className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm"
                  >
                    {sec}
                    <button
                      onClick={() => deleteSection(cls._id, sec)}
                      className="text-red-500"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Section */}
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                placeholder="Add Section (e.g. A)"
                className="border px-3 py-1 rounded w-full"
                value={activeClassId === cls._id ? newSection : ""}
                onChange={(e) => {
                  setActiveClassId(cls._id);
                  setNewSection(e.target.value);
                }}
              />

              <button
                onClick={() => addSection(cls._id)}
                className="bg-green-600 text-white px-3 rounded"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
