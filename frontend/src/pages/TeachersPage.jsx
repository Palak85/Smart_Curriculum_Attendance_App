import { useState, useEffect } from "react";
import axios from "axios";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    class: "",
    section: "",
  });

  const [editingTeacher, setEditingTeacher] = useState(null);

  // Load teachers + classes from DB
  useEffect(() => {
    loadTeachers();
    loadClasses();
  }, []);

  const loadTeachers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/teachers");
      setTeachers(res.data.teachers);
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // When class changes → update section dropdown
  const handleClassSelect = (e) => {
    const className = e.target.value;
    const selectedClass = classes.find((c) => c.className === className);

    setFormData({ ...formData, class: className, section: "" });
    setSections(selectedClass ? selectedClass.sections : []);
  };

  const addTeacher = async () => {
    if (!formData.name || !formData.subject || !formData.class || !formData.section)
      return alert("All fields required!");

    try {
      await axios.post("http://localhost:3000/api/teachers/add", formData);
      setFormData({ name: "", subject: "", class: "", section: "" });
      loadTeachers();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTeacher = async (id) => {
    await axios.delete(`http://localhost:3000/api/teachers/${id}`);
    loadTeachers();
  };

  const openEditModal = (t) => {
    setEditingTeacher(t);

    // Preload sections based on class
    const selected = classes.find((c) => c.className === t.class);
    setSections(selected ? selected.sections : []);

    setFormData({
      name: t.name,
      subject: t.subject,
      class: t.class,
      section: t.section,
    });
  };

  const updateTeacher = async () => {
    await axios.put(
      `http://localhost:3000/api/teachers/${editingTeacher._id}`,
      formData
    );
    setEditingTeacher(null);
    setFormData({ name: "", subject: "", class: "", section: "" });
    loadTeachers();
  };

  // SEARCH & FILTER
  const filteredTeachers = teachers.filter((t) => {
    const searchText = search.toLowerCase();
    const matchesSearch =
      t.name.toLowerCase().includes(searchText) ||
      t.subject.toLowerCase().includes(searchText) ||
      t.class.toLowerCase().includes(searchText) ||
      t.section.toLowerCase().includes(searchText);

    const matchesClass = filterClass ? t.class === filterClass : true;

    return matchesSearch && matchesClass;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Teachers Management</h1>

      {/* Search + Filter */}
      <div className="flex gap-4 mb-5">
        <input
          className="p-2 border rounded-lg w-60"
          placeholder="Search name, subject, class, section..."
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

      {/* Add/Edit Form */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 max-w-md">
        <h2 className="text-xl font-semibold mb-3">
          {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
        </h2>

        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Teacher Name"
          className="w-full p-2 mb-3 border rounded-lg"
        />

        <input
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Subject"
          className="w-full p-2 mb-3 border rounded-lg"
        />

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

        {/* BUTTONS */}
        {editingTeacher ? (
          <div className="flex gap-3">
            <button
              onClick={updateTeacher}
              className="bg-blue-600 text-white flex-1 p-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditingTeacher(null);
                setFormData({ name: "", subject: "", class: "", section: "" });
              }}
              className="bg-gray-300 flex-1 p-2 rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={addTeacher}
            className="bg-blue-600 text-white w-full p-2 rounded"
          >
            Add Teacher
          </button>
        )}
      </div>

      {/* Teachers Table */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Teachers List</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">#</th>
              <th className="p-2">Name</th>
              <th className="p-2">Subject</th>
              <th className="p-2">Class</th>
              <th className="p-2">Section</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTeachers.map((t, i) => (
              <tr key={t._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{i + 1}</td>
                <td className="p-2">{t.name}</td>
                <td className="p-2">{t.subject}</td>
                <td className="p-2">{t.class}</td>
                <td className="p-2">{t.section}</td>

                <td className="p-2 text-center">
                  <button
                    onClick={() => openEditModal(t)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteTeacher(t._id)}
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
