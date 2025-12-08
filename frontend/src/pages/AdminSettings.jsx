// src/pages/AdminSettings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Settings, Save, MapPin, Phone, Mail, Calendar } from "lucide-react";

const AdminSettings = () => {
  const [form, setForm] = useState({
    schoolName: "",
    academicYear: "",
    address: "",
    contactNumber: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // 🔹 Load settings from backend on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/admin/settings/general"
        );
        const data = res.data;
        setForm({
          schoolName: data.schoolName || "",
          academicYear: data.academicYear || "",
          address: data.address || "",
          contactNumber: data.contactNumber || "",
          email: data.email || "",
        });
      } catch (err) {
        console.error(err);
        setMessage("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");

      await axios.put(
        "http://localhost:3000/api/admin/settings/general",
        form,
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}` // agar auth use kar rahe ho
          },
        }
      );

      setMessage("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-gray-600 text-sm">Loading settings...</div>
    );
  }

  return (
    <div className="text-gray-800">
      {/* Header */}
      <section className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
            <Settings className="text-indigo-600" size={26} />
            Admin Settings
          </h1>
          <p className="text-gray-600 text-sm">
            Manage basic school information
          </p>
        </div>
        <div className="flex items-center gap-3">
          {message && (
            <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
              {message}
            </span>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700"
            disabled={saving}
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </section>

      {/* General Settings Card */}
      <section className="bg-white p-4 rounded-lg shadow-sm max-w-3xl">
        <h2 className="font-semibold mb-4">General Settings</h2>

        <div className="space-y-4 text-sm">
          {/* School Name */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              School Name
            </label>
            <input
              type="text"
              value={form.schoolName}
              onChange={(e) => handleChange("schoolName", e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Enter school name"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Address
            </label>
            <div className="flex items-start gap-2">
              <MapPin size={14} className="mt-1 text-gray-500" />
              <textarea
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                rows={3}
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="Full school address"
              />
            </div>
          </div>

          {/* Contact & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Contact Number
              </label>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gray-500" />
                <input
                  type="text"
                  value={form.contactNumber}
                  onChange={(e) =>
                    handleChange("contactNumber", e.target.value)
                  }
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="e.g. +91-9876543210"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Email
              </label>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-gray-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="e.g. info@school.com"
                />
              </div>
            </div>
          </div>

          {/* Academic Year */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Academic Year
            </label>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gray-500" />
              <input
                type="text"
                value={form.academicYear}
                onChange={(e) =>
                  handleChange("academicYear", e.target.value)
                }
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="e.g. 2024-25"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminSettings;
