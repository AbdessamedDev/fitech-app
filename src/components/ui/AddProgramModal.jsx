import { useState } from "react";
import { Button } from "./Button";
import { X } from "../../icons/index";
import { api } from "../../services/api";
import {
  Barbell,
  ChartPie,
  TrendUp,
  ChartLine,
  CloudArrowUp,
  Plus,
  Person,
  Clock,
  CalendarBlank,
  TextT,
  Trash,
} from "@phosphor-icons/react";

const emptySession = () => ({
  id: Date.now() + Math.random(),
  day: "",
  startTime: "",
  endTime: "",
  description: "",
});

export default function AddProgramModal({ onClose, onCreated }) {
  const [isClosing, setIsClosing] = useState(false);
  const [sessions, setSessions] = useState([emptySession()]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    level: "Beginner",
    durationMinutes: "60",
    exerciseType: "Strength",
    startDate: "",
    endDate: "",
    totalPrice: "",
    maxParticipants: "",
    pictureUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 300);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addSession = () => setSessions((prev) => [...prev, emptySession()]);
  const removeSession = (id) => setSessions((prev) => prev.filter((s) => s.id !== id));
  const updateSession = (id, field, value) =>
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);

    const validSessions = sessions
      .filter((s) => s.day && s.startTime && s.endTime)
      .map((s) => ({
        day: s.day,
        startTime: s.startTime,
        endTime: s.endTime,
        description: s.description || null,
      }));

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      level: form.level || null,
      exerciseType: form.exerciseType || null,
      durationMinutes: Number(form.durationMinutes),
      startDate: form.startDate,
      endDate: form.endDate,
      totalPrice: Number(form.totalPrice),
      maxParticipants: Number(form.maxParticipants),
      pictureUrl: form.pictureUrl.trim() || null,
      timeSlots: validSessions,
    };

    if (!payload.name || !payload.startDate || !payload.endDate) {
      setError("Program name, start date, and end date are required.");
      return;
    }
    if (!Number.isFinite(payload.durationMinutes) || payload.durationMinutes <= 0) {
      setError("Duration must be a positive number of minutes.");
      return;
    }
    if (!Number.isFinite(payload.totalPrice) || payload.totalPrice < 0) {
      setError("Please enter a valid price.");
      return;
    }
    if (!Number.isFinite(payload.maxParticipants) || payload.maxParticipants <= 0) {
      setError("Maximum participants must be greater than zero.");
      return;
    }
    if (validSessions.length === 0) {
      setError("Add at least one complete time slot (day, start time, and end time).");
      return;
    }

    setSubmitting(true);
    try {
      await api.createProgram(payload);
      setSuccess(true);
      await onCreated?.();
      setTimeout(handleClose, 650);
    } catch (err) {
      setError(err.message || "Failed to create program.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-end p-4">
      <div
        className={`bg-white w-[480px] h-[calc(100vh-32px)] shadow-2xl flex flex-col rounded-2xl transition-all duration-300 ${
          isClosing ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
          <div className="flex items-center gap-2">
            <Barbell size={22} className="text-secondary-600" />
            <h2 className="text-secondary-700 font-normal text-xl">Add Program</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-secondary-400 hover:text-secondary-700 cursor-pointer transition-colors p-1.5 rounded-md hover:bg-secondary-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-4">

            {/* Program Name */}
            <div>
              <label className="text-xs text-secondary-500 font-normal mb-2 block">Program Name</label>
              <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-50 transition-all">
                <Barbell size={18} className="text-secondary-300 shrink-0" />
                <input
                  name="name"
                  placeholder="e.g. HIIT Training"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs text-secondary-500 font-normal mb-2 block">Description</label>
              <textarea
                name="description"
                placeholder="Describe the program goals and details..."
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full border border-secondary-200 rounded-lg px-3 py-2.5 text-sm text-secondary-700 outline-none focus:border-primary-600 placeholder-secondary-300 resize-none transition-all"
              />
            </div>

            {/* Level & Exercise Type */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Level</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <TrendUp size={18} className="text-secondary-300 shrink-0" />
                  <select
                    name="level"
                    value={form.level}
                    onChange={handleChange}
                    className="w-full text-sm text-secondary-700 outline-none bg-transparent"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Exercise Type</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <ChartLine size={18} className="text-secondary-300 shrink-0" />
                  <select
                    name="exerciseType"
                    value={form.exerciseType}
                    onChange={handleChange}
                    className="w-full text-sm text-secondary-700 outline-none bg-transparent"
                  >
                    <option value="Strength">Strength</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Flexibility">Flexibility</option>
                    <option value="HIIT">HIIT</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Start Date</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <CalendarBlank size={18} className="text-secondary-300 shrink-0" />
                  <input
                    name="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={handleChange}
                    className="w-full text-sm text-secondary-700 outline-none bg-transparent"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs text-secondary-500 font-normal mb-2 block">End Date</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <CalendarBlank size={18} className="text-secondary-300 shrink-0" />
                  <input
                    name="endDate"
                    type="date"
                    value={form.endDate}
                    onChange={handleChange}
                    className="w-full text-sm text-secondary-700 outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Numbers */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Minutes</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <Clock size={18} className="text-secondary-300 shrink-0" />
                  <input
                    name="durationMinutes"
                    type="number"
                    min="1"
                    value={form.durationMinutes}
                    onChange={handleChange}
                    className="w-full text-sm text-secondary-700 outline-none bg-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Price</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <ChartPie size={18} className="text-secondary-300 shrink-0" />
                  <input
                    name="totalPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="15000"
                    value={form.totalPrice}
                    onChange={handleChange}
                    className="w-full text-sm text-secondary-700 outline-none bg-transparent placeholder-secondary-300"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Capacity</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <Person size={18} className="text-secondary-300 shrink-0" />
                  <input
                    name="maxParticipants"
                    type="number"
                    min="1"
                    placeholder="20"
                    value={form.maxParticipants}
                    onChange={handleChange}
                    className="w-full text-sm text-secondary-700 outline-none bg-transparent placeholder-secondary-300"
                  />
                </div>
              </div>
            </div>

            {/* Picture URL */}
            <div>
              <label className="text-xs text-secondary-500 font-normal mb-2 block">Picture URL</label>
              <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-50 transition-all">
                <CloudArrowUp size={18} className="text-secondary-300 shrink-0" />
                <input
                  name="pictureUrl"
                  placeholder="https://example.com/image.jpg"
                  value={form.pictureUrl}
                  onChange={handleChange}
                  className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent"
                />
              </div>
            </div>

            {/* Time Slots */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-secondary-500 font-normal">Time Slots</label>
                <button
                  onClick={addSession}
                  className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-900 cursor-pointer transition-colors"
                >
                  <Plus size={14} /> Add Slot
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {sessions.map((session, index) => (
                  <div key={session.id} className="border border-secondary-200 rounded-xl p-3 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-secondary-600">Slot {index + 1}</span>
                      {sessions.length > 1 && (
                        <button
                          onClick={() => removeSession(session.id)}
                          className="text-secondary-300 hover:text-red-500 cursor-pointer transition-colors"
                        >
                          <Trash size={14} />
                        </button>
                      )}
                    </div>

                    {/* Day */}
                    <div>
                      <label className="text-xs text-secondary-400 mb-1 block">Day</label>
                      <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-9 focus-within:border-primary-600 transition-all">
                        <CalendarBlank size={14} className="text-secondary-300 shrink-0" />
                        <select
                          value={session.day}
                          onChange={(e) => updateSession(session.id, "day", e.target.value)}
                          className="w-full text-sm text-secondary-700 outline-none bg-transparent"
                        >
                          <option value="">Select day</option>
                          <option>Monday</option>
                          <option>Tuesday</option>
                          <option>Wednesday</option>
                          <option>Thursday</option>
                          <option>Friday</option>
                          <option>Saturday</option>
                          <option>Sunday</option>
                        </select>
                      </div>
                    </div>

                    {/* Start & End Time */}
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="text-xs text-secondary-400 mb-1 block">Start Time</label>
                        <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-9 focus-within:border-primary-600 transition-all">
                          <Clock size={14} className="text-secondary-300 shrink-0" />
                          <input
                            type="time"
                            value={session.startTime}
                            onChange={(e) => updateSession(session.id, "startTime", e.target.value)}
                            className="w-full text-sm text-secondary-700 outline-none bg-transparent"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-secondary-400 mb-1 block">End Time</label>
                        <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-9 focus-within:border-primary-600 transition-all">
                          <Clock size={14} className="text-secondary-300 shrink-0" />
                          <input
                            type="time"
                            value={session.endTime}
                            onChange={(e) => updateSession(session.id, "endTime", e.target.value)}
                            className="w-full text-sm text-secondary-700 outline-none bg-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-xs text-secondary-400 mb-1 block">Description</label>
                      <div className="flex items-start border border-secondary-200 rounded-lg px-3 gap-2 focus-within:border-primary-600 transition-all pt-2">
                        <TextT size={14} className="text-secondary-300 shrink-0 mt-0.5" />
                        <textarea
                          value={session.description}
                          onChange={(e) => updateSession(session.id, "description", e.target.value)}
                          placeholder="What will be covered in this session..."
                          rows={2}
                          className="w-full text-sm text-secondary-700 outline-none bg-transparent placeholder-secondary-300 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 px-6 py-4 border-t border-secondary-200">
          {error && (
            <p className="rounded-lg border border-error/15 bg-error-bg px-3 py-2 text-center text-xs font-semibold text-error">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-lg border border-success/20 bg-success-bg px-3 py-2 text-center text-xs font-semibold text-success">
              Program submitted for admin review.
            </p>
          )}
          <div className="flex items-center justify-end gap-3">
            <Button
              onClick={handleClose}
              disabled={submitting}
              className="border border-secondary-300 text-secondary-600 text-sm px-6 py-2.5 rounded-xl hover:bg-secondary-100 transition-all disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || success}
              className="bg-primary-600 text-white text-base font-medium px-6 py-2.5 rounded-xl hover:bg-primary-900 transition-all disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : success ? "Submitted" : "Add Program"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}