import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  EnvelopeSimple,
  Phone,
  MapPin,
  PencilSimple,
  LockKey,
  FloppyDisk,
  LockKeyOpen,
  CreditCard,
  User,
  Key,
} from "@phosphor-icons/react";
import Logo from "../../assets/logoo.png";

const tabs = ["Overview", "Activity", "Permissions"];
const defaultPermissions = ["Full Access", "Billing Admin", "Security Audit"];

export default function MemberProfile() {
  const [activeTab, setActiveTab] = useState("Overview");
  const navigate = useNavigate();
  const location = useLocation();
  const member = location.state?.member;

  if (!member) {
    return (
      <div className="p-6 flex items-center justify-center min-h-full">
        <div className="text-center">
          <p className="text-secondary-500 mb-4">No member selected.</p>
          <button
            onClick={() => navigate("/admin/members")}
            className="bg-primary-600 text-white px-5 py-2.5 rounded-xl hover:bg-primary-700 transition-all cursor-pointer text-sm font-medium"
          >
            Back to Members
          </button>
        </div>
      </div>
    );
  }

  const statusColor =
    member.status === "Active"
      ? "text-success bg-success-bg"
      : member.status === "Suspended"
      ? "text-danger bg-danger-bg"
      : "text-warning bg-warning-bg";

  return (
    <div className="p-6 min-h-full bg-secondary-100">

      {/* Profile Card */}
      <div className="bg-secondary-50 rounded-2xl border border-secondary-200 p-6 mb-5 shadow-sm">
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-6">

            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-primary-600 flex items-center justify-center shrink-0 shadow-lg overflow-hidden">
              <img
                src={Logo}
                alt="member"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-2xl font-bold text-secondary-800">
                  {member.name}
                </h1>

                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor}`}>
                  • {member.status}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <EnvelopeSimple size={16} className="text-secondary-400" />
                  <span>{member.email}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <Phone size={16} className="text-secondary-400" />
                  <span>{member.phone}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <MapPin size={16} className="text-secondary-400" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 border border-secondary-200 text-secondary-600 text-sm px-5 py-2.5 rounded-xl hover:bg-secondary-100 transition-all cursor-pointer font-medium">
              <LockKey size={16} />
              Change Password
            </button>

            <button className="flex items-center gap-2 bg-primary-600 text-white text-sm px-5 py-2.5 rounded-xl hover:bg-primary-700 transition-all cursor-pointer font-medium shadow-sm">
              <PencilSimple size={16} />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Tabs + Content */}
      <div className="bg-secondary-50 rounded-2xl border border-secondary-200 p-6 shadow-sm">

        {/* Tabs */}
        <div className="flex border-b border-secondary-200 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-6 text-sm font-medium border-b-2 transition-all cursor-pointer ${
                activeTab === tab
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-secondary-400 hover:text-secondary-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "Overview" && (
          <div className="flex gap-6">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-secondary-800 mb-5">
                Personal Information
              </h3>

              <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                <div>
                  <p className="text-xs text-secondary-400 uppercase tracking-widest mb-1.5">
                    Full Name
                  </p>
                  <p className="text-sm font-semibold text-secondary-800">
                    {member.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-secondary-400 uppercase tracking-widest mb-1.5">
                    Subscription
                  </p>
                  <p className="text-sm font-semibold text-secondary-800">
                    {member.subscription || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-secondary-400 uppercase tracking-widest mb-1.5">
                    Email Address
                  </p>
                  <p className="text-sm font-semibold text-secondary-800">
                    {member.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-secondary-400 uppercase tracking-widest mb-1.5">
                    Phone Number
                  </p>
                  <p className="text-sm font-semibold text-secondary-800">
                    {member.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Summary */}
            <div className="w-80 shrink-0">
              <div className="border border-secondary-200 rounded-2xl p-6 bg-secondary-50">

                <p className="text-xs font-bold text-secondary-400 uppercase tracking-widest mb-5">
                  Account Summary
                </p>

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-secondary-200">
                  <p className="text-sm text-secondary-500">Account Status</p>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusColor}`}>
                    • {member.status}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-secondary-200">
                  <p className="text-sm text-secondary-500">Expiry Date</p>
                  <p className="text-sm font-semibold text-secondary-700">
                    {member.date}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-5 pb-5 border-b border-secondary-200">
                  <p className="text-sm text-secondary-500">Subscription</p>
                  <p className="text-sm font-semibold text-secondary-700">
                    {member.subscription || "—"}
                  </p>
                </div>

                <p className="text-xs font-bold text-secondary-400 uppercase tracking-widest mb-3">
                  Permissions Preview
                </p>

                <div className="flex flex-wrap gap-2">
                  {defaultPermissions.map((p) => (
                    <span
                      key={p}
                      className="text-xs bg-secondary-100 text-secondary-600 px-3 py-1.5 rounded-full border border-secondary-200 font-medium"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity (ONLY ICONS CHANGED) */}
        {activeTab === "Activity" && (
          <div>
            <h3 className="text-base font-semibold text-secondary-800 mb-4">
              Activity History
            </h3>

            <div className="flex flex-col gap-3">
              {[
                { action: "Logged in", date: "Today, 10:42 AM", icon: <LockKeyOpen size={18} /> },
                { action: "Updated profile information", date: "Yesterday, 3:15 PM", icon: <PencilSimple size={18} /> },
                { action: "Changed password", date: "May 20, 2025, 11:00 AM", icon: <Key size={18} /> },
                { action: "Renewed subscription", date: "May 18, 2025, 9:30 AM", icon: <CreditCard size={18} /> },
                { action: "Joined the platform", date: "May 15, 2025, 2:00 PM", icon: <User size={18} /> },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3.5 border border-secondary-200 rounded-xl hover:bg-secondary-100 transition-all"
                >
                  <span className="text-secondary-600">{item.icon}</span>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-700">
                      {item.action}
                    </p>
                    <p className="text-xs text-secondary-400 mt-0.5">
                      {item.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Permissions (UNCHANGED) */}
        {activeTab === "Permissions" && (
          <div>
            <h3 className="text-base font-semibold text-secondary-800 mb-4">
              Permissions
            </h3>

            <div className="flex flex-col gap-2">
              {defaultPermissions.map((p) => (
                <div
                  key={p}
                  className="flex items-center justify-between p-4 border border-secondary-200 rounded-xl"
                >
                  <span className="text-sm font-medium text-secondary-700">
                    {p}
                  </span>

                  <span className="text-xs font-semibold bg-success-bg text-success px-3 py-1 rounded-full">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 mt-10 pt-6 border-t border-secondary-200">
          <button
            onClick={() => navigate(-1)}
            className="border border-secondary-200 text-secondary-600 text-sm px-6 py-2.5 rounded-xl hover:bg-secondary-100 transition-all cursor-pointer font-medium"
          >
            Cancel
          </button>

          <button className="bg-primary-600 text-white text-sm px-6 py-2.5 rounded-xl hover:bg-primary-700 transition-all cursor-pointer flex items-center gap-2 font-medium shadow-sm">
            <FloppyDisk size={16} />
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}