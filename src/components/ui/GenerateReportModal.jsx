import { useState } from "react";
import { Button } from "./Button";
import {
  FileMagnifyingGlass,
  Calendar,
  User,
  ChartBarHorizontal,
  ChartLine,
  CurrencyCircleDollar,
  Tilde,
  FileText,
  X,
} from "@phosphor-icons/react";

const metrics = [
  { id: "totalRevenue", label: "Total Revenue" },
  { id: "totalUsers", label: "Total Users" },
  { id: "newRegistrations", label: "New Registrations" },
  { id: "activeSubscriptions", label: "Active Subscriptions" },
  { id: "conversionRate", label: "Conversion Rate" },
  { id: "averageOrderValue", label: "Average Order Value" },
];

export default function GenerateReportModal({ onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState({
    totalRevenue: true,
    totalUsers: true,
    newRegistrations: false,
    activeSubscriptions: false,
    conversionRate: false,
    averageOrderValue: false,
  });
  const [form, setForm] = useState({
    reportName: "",
    reportType: "Revenue",
    startDate: "",
    endDate: "",
    coach: "All Coaches",
    program: "All Programs",
    status: "Completed",
    paymentMethod: "All Methods",
  });

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 300);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleMetric = (id) =>
    setSelectedMetrics((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleGenerate = () => {
    const data = { ...form, metrics: selectedMetrics };
    console.log("Generating Excel report:", data);
    alert("Report will be generated in Excel format!");
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-end p-4">
      <div
        className={`bg-white w-[400px] max-h-[calc(100vh-2rem)] overflow-y-auto shadow-2xl flex flex-col transition-all duration-300 rounded-2xl ${
          isClosing ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <FileText size={20} className="text-secondary-500" />
            <h2 className="text-secondary-800 font-normal text-lg tracking-tight">
              Generate Report
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-secondary-400 hover:text-secondary-700 cursor-pointer transition-colors p-1.5 rounded-md hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 flex flex-col gap-5 flex-1">

          {/* Report Name */}
          <div>
            <label className="text-xs text-secondary-400 font-normal mb-1.5 block">
              Enter Report Name
            </label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-100 transition-all bg-gray-50">
              <Tilde size={18} className="text-gray-300 shrink-0" />
              <input
                name="reportName"
                placeholder="eg. Financial Performance"
                value={form.reportName}
                onChange={handleChange}
                className="w-full text-sm outline-none text-secondary-700 placeholder-gray-300 bg-transparent"
              />
            </div>
          </div>

          {/* Report Type */}
          <div>
            <label className="text-xs text-secondary-400 font-normal mb-1.5 block">
              Select Report Type
            </label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-500 transition-all bg-gray-50">
              <FileMagnifyingGlass size={18} className="text-gray-300 shrink-0" />
              <select
                name="reportType"
                value={form.reportType}
                onChange={handleChange}
                className="w-full text-sm text-secondary-700 outline-none bg-transparent"
              >
                <option value="Revenue">Revenue</option>
                <option value="Members">Members</option>
                <option value="Programs">Programs</option>
                <option value="Equipment">Equipment</option>
              </select>
            </div>
          </div>

          {/* Start & End Date */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-secondary-400 font-normal mb-1.5 block">
                Select Start Date
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-500 transition-all bg-gray-50">
                <Calendar size={18} className="text-gray-300 shrink-0" />
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
              <label className="text-xs text-secondary-400 font-normal mb-1.5 block">
                Select End Date
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-500 transition-all bg-gray-50">
                <Calendar size={18} className="text-gray-300 shrink-0" />
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

          {/* Filters */}
          <div>
            <label className="text-[10px] text-secondary-400 font-semibold mb-3 block uppercase tracking-widest">
              Filters
            </label>
            <div className="grid grid-cols-2 gap-3">

              {/* Coach */}
              <div>
                <label className="text-xs text-secondary-400 mb-1 block">Coach</label>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-500 transition-all bg-gray-50">
                  <User size={16} className="text-gray-300 shrink-0" />
                  <select
                    name="coach"
                    value={form.coach}
                    onChange={handleChange}
                    className="w-full text-sm text-secondary-700 outline-none bg-transparent"
                  >
                    <option>All Coaches</option>
                    <option>Ishaq Boukaddah</option>
                    <option>Marcus Thorne</option>
                  </select>
                </div>
              </div>

              {/* Program */}
              <div>
                <label className="text-xs text-secondary-400 mb-1 block">Program</label>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-500 transition-all bg-gray-50">
                  <ChartBarHorizontal size={16} className="text-gray-300 shrink-0" />
                  <select
                    name="program"
                    value={form.program}
                    onChange={handleChange}
                    className="w-full text-sm text-secondary-700 outline-none bg-transparent"
                  >
                    <option>All Programs</option>
                    <option>Hypertrophy Blueprint</option>
                    <option>Weight Loss Plan</option>
                  </select>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-xs text-secondary-400 mb-1 block">Status</label>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-500 transition-all bg-gray-50">
                  <ChartLine size={16} className="text-gray-300 shrink-0" />
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full text-sm text-secondary-700 outline-none bg-transparent"
                  >
                    <option>Completed</option>
                    <option>Pending</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="text-xs text-secondary-400 mb-1 block">Payment Method</label>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-500 transition-all bg-gray-50">
                  <CurrencyCircleDollar size={16} className="text-gray-300 shrink-0" />
                  <select
                    name="paymentMethod"
                    value={form.paymentMethod}
                    onChange={handleChange}
                    className="w-full text-sm text-secondary-700 outline-none bg-transparent"
                  >
                    <option>All Methods</option>
                    <option>Cash</option>
                    <option>Card</option>
                    <option>Bank Transfer</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Selection */}
          <div>
            <label className="text-[10px] text-secondary-400 font-semibold mb-3 block uppercase tracking-widest">
              Metrics Selection
            </label>
            <div className="grid grid-cols-2 gap-2">
              {metrics.map((metric) => (
                <label
                  key={metric.id}
                  onClick={() => toggleMetric(metric.id)}
                  className={`flex items-center gap-2.5 cursor-pointer px-3 py-2.5 rounded-lg border transition-all select-none ${
                    selectedMetrics[metric.id]
                      ? "border-primary-300 bg-primary-50"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border-2 transition-all shrink-0 ${
                      selectedMetrics[metric.id]
                        ? "bg-primary-600 border-primary-600"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {selectedMetrics[metric.id] && (
                      <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs text-secondary-600">
                    {metric.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Format Options */}
          <div>
            <label className="text-[10px] text-secondary-400 font-semibold mb-3 block uppercase tracking-widest">
              Format Options
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-lg text-sm font-medium">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
                Excel
              </div>
              <p className="text-xs text-gray-400 italic">
                Report will be exported in Excel format (.xlsx)
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white rounded-b-2xl">
          <Button
            onClick={handleClose}
            className="border border-gray-200 text-secondary-500 text-sm px-5 py-2 rounded-lg hover:bg-gray-50 transition-all"
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            className="bg-primary-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-primary-700 transition-all flex items-center gap-2"
          >
            <FileText size={15} />
            Generate Report
          </Button>
        </div>
      </div>
    </div>
  );
}