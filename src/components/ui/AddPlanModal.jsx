 import { useState } from "react";
import { Button } from "./Button";
import { X } from "../../icons/index";
import { api } from "../../services/api";
import {
  MoneyWavy,
  ListNumbers,
  Calendar,
  HourglassSimple,
  CalendarDots,
  Key,
  TextT,
} from "@phosphor-icons/react";

const ACCESS_RULE_LABELS = {
  weekly: "Weekly access",
  monthly: "Monthly access",
  annual: "Annual access",
};

export default function AddPlanModal({ onClose, onCreated }) {
  const [isClosing, setIsClosing] = useState(false);
  const [form, setForm] = useState({
    planName: "",
    description: "",
    price: "4500",
    sessionCount: "13",
    planName2: "",
    startDate: "",
    endDate: "",
    durationValue: "1",
    unit: "Month",
  });
  const [access, setAccess] = useState({
    weekly: true,
    monthly: false,
    annual: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 300);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleAccess = (key) =>
    setAccess((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);

    const price = Number(form.price);
    const durationValue = form.durationValue === "" ? null : Number(form.durationValue);
    const sessionCount = form.sessionCount === "" ? null : Number(form.sessionCount);

    if (!form.planName.trim()) {
      setError("Plan name is required.");
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setError("Please enter a valid plan price.");
      return;
    }
    if (durationValue !== null && (!Number.isInteger(durationValue) || durationValue <= 0)) {
      setError("Duration must be a positive whole number.");
      return;
    }
    if (sessionCount !== null && (!Number.isInteger(sessionCount) || sessionCount < 0)) {
      setError("Session count must be zero or a positive whole number.");
      return;
    }

    const accessRules = Object.entries(access)
      .filter(([, enabled]) => enabled)
      .map(([key]) => ACCESS_RULE_LABELS[key]);

    setLoading(true);
    try {
      await api.createPlan({
        name: form.planName.trim(),
        description: form.description.trim() || null,
        price,
        durationValue,
        durationUnit: form.unit,
        sessionCount,
        accessRules,
      });
      setSuccess(true);
      onCreated?.();
      setTimeout(handleClose, 700);
    } catch (err) {
      console.error("Failed to create plan:", err);
      setError(err.message || "Failed to create plan. Please check the backend response.");
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-end p-4">
      <div
        className={`bg-white w-[480px] h-[calc(100vh-32px)] shadow-2xl flex flex-col rounded-2xl border border-secondary-200 transition-all duration-300 ${
          isClosing ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-secondary-600" />
            <h2 className="text-secondary-700 font-normal text-lg">
              Add Plan
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-secondary-400 hover:text-secondary-700 cursor-pointer p-1.5 rounded-lg hover:bg-secondary-100 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-4">

            {/* Plan Name */}
            <div>
              <label className="text-xs text-secondary-500 font-normal mb-2 block">
                Plan Name
              </label>
              <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-11 focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-50 transition-all bg-secondary-100">
                <TextT size={18} className="text-secondary-400 shrink-0" />
                <input
                  name="planName"
                  placeholder="e.g., Personal Training Bundle"
                  value={form.planName}
                  onChange={handleChange}
                  className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs text-secondary-500 font-normal mb-2 block">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Provide details about sessions, inclusions, and benefits..."
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full border border-secondary-200 rounded-lg px-3 py-2.5 text-sm text-secondary-700 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-50 placeholder-secondary-300 resize-none transition-all bg-secondary-100"
              />
            </div>
{/* Price & Session Count */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-secondary-500 font-normal mb-2 block">
                  Price ($)
                </label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-11 focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-50 transition-all bg-secondary-100">
                  <MoneyWavy size={18} className="text-secondary-400 shrink-0" />
                  <input
                    name="price"
                    type="number"
                    placeholder="4500"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs text-secondary-500 font-normal mb-2 block">
                  Session Count
                </label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-11 focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-50 transition-all bg-secondary-100">
                  <ListNumbers size={18} className="text-secondary-400 shrink-0" />
                  <input
                    name="sessionCount"
                    type="number"
                    placeholder="13"
                    value={form.sessionCount}
                    onChange={handleChange}
                    className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Plan Name 2 */}
            <div>
              <label className="text-xs text-secondary-500 font-normal mb-2 block">
                Plan Name
              </label>
              <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-11 focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-50 transition-all bg-secondary-100">
                <TextT size={18} className="text-secondary-400 shrink-0" />
                <input
                  name="planName2"
                  placeholder="e.g., Personal Training Bundle"
                  value={form.planName2}
                  onChange={handleChange}
                  className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent"
                />
              </div>
            </div>
 {/* Start Date & Calculated End Date */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-secondary-500 font-normal mb-2 block">
                  Start Date
                </label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-11 focus-within:border-primary-600 transition-all bg-secondary-100">
                  <Calendar size={18} className="text-secondary-400 shrink-0" />
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
                <label className="text-xs text-secondary-500 font-normal mb-2 block">
                  Calculated end Date
                </label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-11 focus-within:border-primary-600 transition-all bg-secondary-200">
                  <CalendarDots size={18} className="text-secondary-400 shrink-0" />
                  <input
                    name="endDate"
                    type="date"
                    value={form.endDate}
                    onChange={handleChange}
                    className="w-full text-sm text-secondary-400 outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Duration Value & Unit */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-secondary-500 font-normal mb-2 block">
                  Duration Value
                </label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-11 focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-50 transition-all bg-secondary-100">
                  <HourglassSimple size={18} className="text-secondary-400 shrink-0" />
                  <input
                    name="durationValue"
                    type="number"
                    placeholder="1"
                    value={form.durationValue}
                    onChange={handleChange}
                    className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs text-secondary-500 font-normal mb-2 block">
                  Unit
                </label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-11 focus-within:border-primary-600 transition-all bg-secondary-100">
                  <CalendarDots size={18} className="text-secondary-400 shrink-0" />
                  <select
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    className="w-full text-sm text-secondary-700 outline-none bg-transparent"
                  >
                    <option value="Month">Month</option>
                    <option value="Week">Week</option>
                    <option value="Year">Year</option>
                  </select>
                </div>
              </div>
            </div>
{/* Access Rule */}
            <div>
              <label className="text-xs text-secondary-500 font-normal mb-2 block">
                Access Rule 1
              </label>
              <div className="flex flex-col gap-2">
                {[
                  { key: "weekly", label: "Weekly access" },
                  { key: "monthly", label: "Monthly access" },
                  { key: "annual", label: "Annual access" },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between px-4 py-3 border border-secondary-200 rounded-xl bg-secondary-100"
                  >
                    <div className="flex items-center gap-2">
                      <Key size={18} className="text-secondary-400" />
                      <span className="text-sm text-secondary-600">
                        {item.label}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleAccess(item.key)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                        access[item.key] ? "bg-primary-600" : "bg-secondary-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                          access[item.key] ? "right-1" : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 px-6 py-4 border-t border-secondary-200">
          {error && (
            <p className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-center text-xs font-semibold text-rose-600">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-center text-xs font-semibold text-emerald-600">
              Plan created successfully.
            </p>
          )}
          <div className="flex items-center justify-end gap-3">
          <Button
            onClick={handleClose}
            disabled={loading}
            className="border border-secondary-300 text-secondary-600 text-sm px-6 py-2.5 rounded-xl hover:bg-secondary-100 transition-all"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || success}
            className="bg-primary-600 text-white text-sm px-6 py-2.5 rounded-xl hover:bg-primary-900 transition-all font-medium disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Saving..." : success ? "Saved" : "Add Plan"}
          </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
