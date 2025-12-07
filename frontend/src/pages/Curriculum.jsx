import { useState } from "react";

export default function CurriculumPage() {
  const [curriculum, setCurriculum] = useState([
    { id: 1, class: "Class 1", subject: "Math", topic: "Numbers", month: "April" },
    { id: 2, class: "Class 2", subject: "English", topic: "Grammar", month: "April" },
  ]);

  const [formData, setFormData] = useState({
    class: "",
    subject: "",
    topic: "",
    month: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addCurriculum = () => {
    if (!formData.class || !formData.subject || !formData.topic || !formData.month) return;

    const newEntry = {
      id: curriculum.length + 1,
      class: formData.class,
      subject: formData.subject,
      topic: formData.topic,
      month: formData.month,
    };

    setCurriculum([...curriculum, newEntry]);
    setFormData({ class: "", subject: "", topic: "", month: "" });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Curriculum Management</h1>

      {/* Add Curriculum Form */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 max-w-md">
        <h2 className="text-xl font-semibold mb-3">Add Curriculum</h2>

        <input
          name="class"
          value={formData.class}
          onChange={handleChange}
          placeholder="Class (e.g., Class 1)"
          className="w-full p-2 mb-3 border rounded-lg"
        />

        <input
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Subject (e.g., Math)"
          className="w-full p-2 mb-3 border rounded-lg"
        />

        <input
          name="topic"
          value={formData.topic}
          onChange={handleChange}
          placeholder="Topic (e.g., Numbers Chapter)"
          className="w-full p-2 mb-3 border rounded-lg"
        />

        <input
          name="month"
          value={formData.month}
          onChange={handleChange}
          placeholder="Month (e.g., April)"
          className="w-full p-2 mb-3 border rounded-lg"
        />

        <button
          onClick={addCurriculum}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700"
        >
          Add Curriculum
        </button>
      </div>

      {/* Curriculum Table */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Curriculum List</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">ID</th>
              <th className="p-2">Class</th>
              <th className="p-2">Subject</th>
              <th className="p-2">Topic</th>
              <th className="p-2">Month</th>
            </tr>
          </thead>
          <tbody>
            {curriculum.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{c.id}</td>
                <td className="p-2">{c.class}</td>
                <td className="p-2">{c.subject}</td>
                <td className="p-2">{c.topic}</td>
                <td className="p-2">{c.month}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
