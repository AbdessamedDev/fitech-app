import { useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import {
  User,
  EnvelopeSimple,
  Phone,
} from "../../icons/index";

const tabs = ["Information", "Subscription"];

export default function AddMemberModal({ onClose }) {
  const [activeTab, setActiveTab] = useState("Information");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "Male",
    birthDate: "",
    medicalCertificate: null,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, medicalCertificate: e.target.files[0] });
  };

  const handleSubmit = () => {
    console.log("Member data:", form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-end">
      <div className="bg-white w-[480px] h-full shadow-xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
          <div className="flex items-center gap-2">
            <User size={20} className="text-primary-600" />
            <h2 className="text-secondary-700 font-semibold text-base">Add Member</h2>
          </div>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-secondary-700 cursor-pointer font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border-light px-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-all cursor-pointer ${
                activeTab === tab
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-secondary-400 hover:text-secondary-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">

          {activeTab === "Information" && (
            <div className="flex flex-col gap-4">

              {/* Full Name */}
              <div>
                <label className="text-xs text-secondary-600 font-medium mb-1 block">
                  Enter member's full name
                </label>
                <div className="flex gap-3">
                  <div className="flex items-center border border-secondary-300 rounded-sm px-3 gap-2 flex-1 focus-within:border-primary-600">
                    <User size={15} className="text-secondary-400" />
                    <input
                      name="firstName"
                      placeholder="First Name"
                      value={form.firstName}
                      onChange={handleChange}
                      className="w-full py-2 text-sm outline-none text-secondary-700 placeholder-secondary-400"
                    />
                  </div>
                  <div className="flex items-center border border-secondary-300 rounded-sm px-3 gap-2 flex-1 focus-within:border-primary-600">
                    <User size={15} className="text-secondary-400" />
                    <input
                      name="lastName"
                      placeholder="Last Name"
                      value={form.lastName}
                      onChange={handleChange}
                      className="w-full py-2 text-sm outline-none text-secondary-700 placeholder-secondary-400"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs text-secondary-600 font-medium mb-1 block">
                  Enter member's Email
                </label>
                <div className="flex items-center border border-secondary-300 rounded-sm px-3 gap-2 focus-within:border-primary-600">
                  <EnvelopeSimple size={15} className="text-secondary-400" />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full py-2 text-sm outline-none text-secondary-700 placeholder-secondary-400"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs text-secondary-600 font-medium mb-1 block">
                  Enter member's Phone Number
                </label>
                <div className="flex items-center border border-secondary-300 rounded-sm px-3 gap-2 focus-within:border-primary-600">
                  <Phone size={15} className="text-secondary-400" />
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full py-2 text-sm outline-none text-secondary-700 placeholder-secondary-400"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="text-xs text-secondary-600 font-medium mb-1 block">
                  Select member's Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full border border-secondary-300 rounded-sm px-3 py-2 text-sm text-secondary-700 outline-none focus:border-primary-600"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Birth Date */}
              <div>
                <label className="text-xs text-secondary-600 font-medium mb-1 block">
                  Select member's Birth date
                </label>
                <input
                  name="birthDate"
                  type="date"
                  value={form.birthDate}
                  onChange={handleChange}
                  className="w-full border border-secondary-300 rounded-sm px-3 py-2 text-sm text-secondary-700 outline-none focus:border-primary-600"
                />
              </div>

              {/* Medical Certificate */}
              <div>
                <label className="text-xs text-secondary-600 font-medium mb-1 block">
                  Upload member's Medical Certificate
                </label>
                <div className="border-2 border-dashed border-secondary-300 rounded-md p-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-secondary-400 text-3xl">☁</div>
                    <p className="text-xs text-secondary-400">
                      choose a file or drag and drop it here.
                    </p>
                    <p className="text-xs text-secondary-300">PDF, JPEG, Max up to 20MB</p>
                    <label className="mt-2 cursor-pointer">
                      <span className="border border-secondary-300 text-secondary-600 text-xs px-4 py-1.5 rounded-sm hover:bg-secondary-100 transition">
                        Browse File
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.jpeg,.jpg"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === "Subscription" && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-secondary-500">Subscription content coming soon...</p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-light">
          <Button
            onClick={onClose}
            className="btn-outline text-sm text-secondary-600"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="btn-primary text-sm text-white"
          >
            Add Member
          </Button>
        </div>

      </div>
    </div>
  );
}