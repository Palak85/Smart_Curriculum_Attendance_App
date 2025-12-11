// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function Students() {
//   const [students, setStudents] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filterClass, setFilterClass] = useState("");
//   const [filterSection, setFilterSection] = useState("");


//   const [formData, setFormData] = useState({
//     name: "",
//     class: "",
//     section: "",
//   });

//   const [editingStudent, setEditingStudent] = useState(null);

//   useEffect(() => {
//     loadStudents();
//   }, []);

//   const loadStudents = async () => {
//     const res = await axios.get("http://localhost:3000/api/students");
//     setStudents(res.data.students);
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const addStudent = async () => {
//     if (!formData.name || !formData.class || !formData.section) return;
//     await axios.post("http://localhost:3000/api/students/add", formData);
//     loadStudents();
//     setFormData({ name: "", class: "", section: "" });
//   };

//   const deleteStudent = async (id) => {
//     await axios.delete(`http://localhost:3000/api/students/${id}`);
//     loadStudents();
//   };

//   const openEditModal = (student) => {
//     setEditingStudent(student);
//     setFormData({
//       name: student.name,
//       class: student.class,
//       section: student.section,
//     });
//   };

//   const updateStudent = async () => {
//     await axios.put(`http://localhost:3000/api/students/${editingStudent._id}`, formData);
//     setEditingStudent(null);
//     loadStudents();
//   };

//   // SEARCH + FILTER
//   const filteredStudents = students.filter((s) => {
//     const matchesSearch =
//       s.name.toLowerCase().includes(search.toLowerCase()) ||
//       s.class.toLowerCase().includes(search.toLowerCase()) ||
//       s.section.toLowerCase().includes(search.toLowerCase());

//     // const matchesClass = filterClass ? s.class === filterClass : true;
//     const matchesClass = filterClass
//     ? s.class.toLowerCase().replace(/\s+/g, "") ===
//         filterClass.toLowerCase().replace(/\s+/g, "")
//     : true;

//     const matchesSection = filterSection ? s.section === filterSection : true;
//     return matchesSearch && matchesClass && matchesSection;
//   });

//   return (
//     <div className="p-6">

//       {/* Title */}
//       <h1 className="text-2xl font-bold mb-4">Students Management</h1>

//       {/* Search + Filter */}
//       <div className="flex gap-4 mb-5">
//         <input
//           className="p-2 border rounded-lg w-60"
//           placeholder="Search name, class, section..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         <select
//           className="p-2 border rounded-lg"
//           value={filterClass}
//           onChange={(e) => setFilterClass(e.target.value)}
//         >
//           <option value="">All Classes</option>
//           <option value="Class 1">Class 1</option>
//           <option value="Class 2">Class 2</option>
//           <option value="Class 3">Class 3</option>
//         </select>

//         <select
//         className="p-2 border rounded-lg"
//         value={filterSection}
//         onChange={(e) => setFilterSection(e.target.value)}
//         >
//         <option value="">All Sections</option>
//         <option value="A">A</option>
//         <option value="B">B</option>
//         <option value="C">C</option>
//         </select>

//       </div>

//       {/* Add Student Form */}
//       <div className="bg-white p-4 rounded-xl shadow mb-6 max-w-md">
//         <h2 className="text-xl font-semibold mb-3">Add New Student</h2>

//         <input
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           placeholder="Student Name"
//           className="w-full p-2 mb-3 border rounded-lg"
//         />

//         <input
//           name="class"
//           value={formData.class}
//           onChange={handleChange}
//           placeholder="Class"
//           className="w-full p-2 mb-3 border rounded-lg"
//         />

//         <input
//           name="section"
//           value={formData.section}
//           onChange={handleChange}
//           placeholder="Section"
//           className="w-full p-2 mb-3 border rounded-lg"
//         />

//         <button
//           onClick={addStudent}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700"
//         >
//           Add Student
//         </button>
//       </div>

//       {/* Students Table */}
//       <div className="bg-white p-4 rounded-xl shadow">
//         <h2 className="text-xl font-semibold mb-4">Students List</h2>

//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-gray-100 text-left">
//               <th className="p-2">#</th>
//               <th className="p-2">Name</th>
//               <th className="p-2">Class</th>
//               <th className="p-2">Section</th>
//               <th className="p-2 text-center">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredStudents.map((s, i) => (
//               <tr key={s._id} className="border-b hover:bg-gray-50">
//                 <td className="p-2">{i + 1}</td>
//                 <td className="p-2">{s.name}</td>
//                 <td className="p-2">{s.class}</td>
//                 <td className="p-2">{s.section}</td>
//                 <td className="p-2 text-center flex gap-2">
//                   <button
//                     onClick={() => openEditModal(s)}
//                     className="bg-yellow-500 text-white px-3 py-1 rounded"
//                   >
//                     Edit
//                   </button>

//                   <button
//                     onClick={() => deleteStudent(s._id)}
//                     className="bg-red-500 text-white px-3 py-1 rounded"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* EDIT MODAL */}
//       {editingStudent && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-xl shadow w-96">
//             <h2 className="text-xl font-semibold mb-4">Edit Student</h2>

//             <input
//               name="name"
//               onChange={handleChange}
//               value={formData.name}
//               className="w-full p-2 mb-3 border rounded-lg"
//             />

//             <input
//               name="class"
//               onChange={handleChange}
//               value={formData.class}
//               className="w-full p-2 mb-3 border rounded-lg"
//             />

//             <input
//               name="section"
//               onChange={handleChange}
//               value={formData.section}
//               className="w-full p-2 mb-3 border rounded-lg"
//             />

//             <div className="flex gap-3 mt-3">
//               <button
//                 onClick={updateStudent}
//                 className="bg-blue-600 text-white flex-1 p-2 rounded"
//               >
//                 Save
//               </button>

//               <button
//                 onClick={() => setEditingStudent(null)}
//                 className="bg-gray-300 flex-1 p-2 rounded"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }


// StudentsPage.jsx
import { useState, useEffect } from "react";
import axios from "axios";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    roll: "",
    class: "",
    section: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [editingStudent, setEditingStudent] = useState(null);

  // Load students + classes
  useEffect(() => {
    loadStudents();
    loadClasses();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/students");
      setStudents(res.data.students);
    } catch (err) {
      console.error(err);
    }
  };

  const loadClasses = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/classes");
      setClasses(res.data.classes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Class → Section dropdown update
  const handleClassSelect = (e) => {
    const className = e.target.value;
    const selected = classes.find((c) => c.className === className);

    setFormData({ ...formData, class: className, section: "" });
    setSections(selected ? selected.sections : []);
  };

  const addStudent = async () => {
    if (!formData.name || !formData.roll || !formData.class || !formData.section || !formData.email || !formData.password)
      return alert("Name, roll, class, section, email and password are required");

    try {
      await axios.post("http://localhost:3000/api/students/add", formData);
      setFormData({ name: "", roll: "", class: "", section: "", email: "", password: "" });
      loadStudents();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add student");
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/students/${id}`);
      loadStudents();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (s) => {
    setEditingStudent(s);

    const selected = classes.find((c) => c.className === s.class);
    setSections(selected ? selected.sections : []);

    setFormData({
      name: s.name,
      roll: s.roll,
      class: s.class,
      section: s.section,
      email: s.email || "",
      password: "",
    });
  };

  const updateStudent = async () => {
    try {
      await axios.put(
        `http://localhost:3000/api/students/${editingStudent._id}`,
        formData
      );

      setEditingStudent(null);
      setFormData({ name: "", roll: "", class: "", section: "", email: "", password: "" });
      loadStudents();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update student");
    }
  };

  // SEARCH + FILTER
  const filteredStudents = students.filter((s) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      s.name.toLowerCase().includes(searchLower) ||
      s.roll.toLowerCase().includes(searchLower) ||
      s.class.toLowerCase().includes(searchLower) ||
      s.section.toLowerCase().includes(searchLower) ||
      (s.email || "").toLowerCase().includes(searchLower);

    const matchesClass = filterClass ? s.class === filterClass : true;

    return matchesSearch && matchesClass;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Students Management</h1>

      {/* Search + Filter */}
      <div className="flex gap-4 mb-5">
        <input
          className="p-2 border rounded-lg w-60"
          placeholder="Search name, roll, class, section..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-2 border rounded-lg"
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
        >
          <option value="">All Classes</option>
          {classes.map((c) => (
            <option key={c._id} value={c.className}>
              {c.className}
            </option>
          ))}
        </select>
      </div>

      {/* Add / Edit Form */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 max-w-md">
        <h2 className="text-xl font-semibold mb-3">
          {editingStudent ? "Edit Student" : "Add New Student"}
        </h2>

        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Student Name"
          className="w-full p-2 mb-3 border rounded-lg"
        />

        <input
          name="roll"
          value={formData.roll}
          onChange={handleChange}
          placeholder="Roll No"
          className="w-full p-2 mb-3 border rounded-lg"
        />

        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Student Email (for login)"
          className="w-full p-2 mb-3 border rounded-lg"
        />

        <div className="mb-3">
          <div className="flex items-center gap-2">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder={editingStudent ? "New Password (optional)" : "Password (for login)"}
              className="w-full p-2 border rounded-lg"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {formData.email && formData.password && (
            <p className="text-xs text-gray-600 mt-1">
              Email: {formData.email} | Password: {showPassword ? formData.password : "••••••"}
            </p>
          )}
        </div>

        {/* CLASS DROPDOWN */}
        <select
          name="class"
          value={formData.class}
          onChange={handleClassSelect}
          className="w-full p-2 mb-3 border rounded-lg"
        >
          <option value="">Select Class</option>
          {classes.map((c) => (
            <option key={c._id} value={c.className}>
              {c.className}
            </option>
          ))}
        </select>

        {/* SECTION DROPDOWN */}
        <select
          name="section"
          value={formData.section}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded-lg"
        >
          <option value="">Select Section</option>
          {sections.map((sec) => (
            <option key={sec} value={sec}>
              {sec}
            </option>
          ))}
        </select>

        {/* Buttons */}
        {editingStudent ? (
          <div className="flex gap-3">
            <button
              onClick={updateStudent}
              className="bg-blue-600 text-white flex-1 p-2 rounded"
            >
              Save
            </button>

            <button
              onClick={() => {
                setEditingStudent(null);
                setFormData({ name: "", roll: "", class: "", section: "", email: "", password: "" });
              }}
              className="bg-gray-300 flex-1 p-2 rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={addStudent}
            className="bg-blue-600 text-white w-full p-2 rounded"
          >
            Add Student
          </button>
        )}
      </div>

      {/* Students Table */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Students List</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">#</th>
              <th className="p-2">Name</th>
              <th className="p-2">Roll No</th>
              <th className="p-2">Class</th>
              <th className="p-2">Section</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((s, i) => (
              <tr key={s._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{i + 1}</td>
                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.roll}</td>
                <td className="p-2">{s.class}</td>
                <td className="p-2">{s.section}</td>

                <td className="p-2 text-center">
                  <button
                    onClick={() => openEditModal(s)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteStudent(s._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
