import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  EnvelopeSimple, Phone, MapPin, PencilSimple, LockKey,
  FloppyDisk, LockKeyOpen, CreditCard, User, Key,
} from "@phosphor-icons/react";
import Logo from "../../assets/Logoo.png";
import { useAuthContext } from "../../features/auth/context/AuthContext";

const tabs = ["Overview", "Activity", "Permissions"];
const defaultPermissions = ["Full Access", "Billing Admin", "Security Audit"];

export default function CoachProfile() {
  const [activeTab, setActiveTab] = useState("Overview");
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const coach = {
    name: user?.name || user?.email || "Ishaq Boukaddah",
    role: "COACH",
    email: user?.email || "ishaqBoukaddah@Fitteck.com",
    phone: user?.phone || "+1 (555) 012-4488",
    location: "San Francisco, CA",
    fullName: user?.fullName || user?.name || "Ishaq Boukaddah",
    officialTitle: user?.title || "Head of Coaching",
    emailAddress: user?.email || "isaac.bh@fluidarch.io",
    phoneNumber: user?.phone || "+1 (555) 012-4488",
    bio: "Certified fitness coach specializing in strength training and muscle development. Focused on helping clients achieve their goals through structured programs and personalized guidance.",
    accountStatus: "ACTIVE",
    lastActive: "Today, 10:42 AM",
    createdDate: "Oct 12, 2022",
  };

  return (
    <div className="p-6 min-h-full bg-secondary-100">

      {/* Profile Header Card */}
      <div className="bg-secondary-50 rounded-2xl border border-secondary-200 p-6 mb-5 shadow-sm">
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-6">

            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-primary-600 flex items-center justify-center shrink-0 shadow-lg overflow-hidden">
              <img src={Logo} alt="coach" className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = "none"; }} />
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-2xl font-bold text-secondary-800">{coach.name}</h1>
                <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                  • {coach.role}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <EnvelopeSimple size={16} className="text-secondary-400" />
                  <span>{coach.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <Phone size={16} className="text-secondary-400" />
                  <span>{coach.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <MapPin size={16} className="text-secondary-400" />
                  <span>{coach.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 border border-secondary-200 text-secondary-600 text-sm px-5 py-2.5 rounded-xl hover:bg-secondary-100 transition-all cursor-pointer font-medium">
              <LockKey size={16} /> Change Password
            </button>
            <button className="flex items-center gap-2 bg-primary-600 text-white text-sm px-5 py-2.5 rounded-xl hover:bg-primary-700 transition-all cursor-pointer font-medium shadow-sm">
              <PencilSimple size={16} /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Tabs + Content */}
      <div className="bg-secondary-50 rounded-2xl border border-secondary-200 p-6 shadow-sm">

        {/* Tabs */}
        <div className="flex border-b border-secondary-200 mb-6">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`py-3 px-6 text-sm font-medium border-b-2 transition-all cursor-pointer ${
                activeTab === tab ? "border-primary-600 text-primary-600" : "border-transparent text-secondary-400 hover:text-secondary-700"
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "Overview" && (
          <div className="flex gap-6">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-secondary-800 mb-5">Personal Information</h3>
              <div className="grid grid-cols-2 gap-x-10 gap-y-6 mb-8">
                <div>
                  <p className="text-xs text-secondary-400 uppercase tracking-widest mb-1.5">Full Name</p>
                  <p className="text-sm font-semibold text-secondary-800">{coach.fullName}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary-400 uppercase tracking-widest mb-1.5">Official Title</p>
                  <p className="text-sm font-semibold text-secondary-800">{coach.officialTitle}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary-400 uppercase tracking-widest mb-1.5">Email Address</p>
                  <p className="text-sm font-semibold text-secondary-800">{coach.emailAddress}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary-400 uppercase tracking-widest mb-1.5">Phone Number</p>
                  <p className="text-sm font-semibold text-secondary-800">{coach.phoneNumber}</p>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-secondary-800 mb-3">Bio</h3>
                <div className="border border-secondary-200 rounded-xl p-4 bg-secondary-100">
                  <p className="text-sm text-secondary-500 leading-relaxed">{coach.bio}</p>
                </div>
              </div>
            </div>

            {/* Account Summary (FIXED WIDTH) */}
            <div className="w-96 shrink-0">
              <div className="border border-secondary-200 rounded-2xl p-5 bg-secondary-50">
                <p className="text-xs font-bold text-secondary-400 uppercase tracking-widest mb-5">
                  Account Summary
                </p>

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-secondary-200">
                  <p className="text-sm text-secondary-500">Account Status</p>
                  <span className="text-xs font-bold text-success bg-success-bg px-3 py-1 rounded-full">
                    • ACTIVE
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-secondary-200 whitespace-nowrap">
                  <p className="text-sm text-secondary-500">Last Active</p>
                  <p className="text-sm font-semibold text-secondary-700">{coach.lastActive}</p>
                </div>

                <div className="flex items-center justify-between mb-5 pb-5 border-b border-secondary-200 whitespace-nowrap">
                  <p className="text-sm text-secondary-500">Created Date</p>
                  <p className="text-sm font-semibold text-secondary-700">{coach.createdDate}</p>
                </div>

                <p className="text-xs font-bold text-secondary-400 uppercase tracking-widest mb-3">
                  Permissions Preview
                </p>

                <div className="flex flex-wrap gap-2">
                  {defaultPermissions.map((p) => (
                    <span key={p} className="text-xs bg-secondary-100 text-secondary-600 px-3 py-1.5 rounded-full border border-secondary-200 font-medium">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity */}
        {activeTab === "Activity" && (
          <div>
            <h3 className="text-base font-semibold text-secondary-800 mb-4">Activity History</h3>
            <div className="flex flex-col gap-3">
              {[{ action: "Logged in", date: "Today, 10:42 AM", icon: <LockKeyOpen size={18} /> }].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3.5 border border-secondary-200 rounded-xl hover:bg-secondary-100 transition-all">
                  <span className="text-secondary-600">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-700">{item.action}</p>
                    <p className="text-xs text-secondary-400 mt-0.5">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Permissions */}
        {activeTab === "Permissions" && (
          <div>
            <h3 className="text-base font-semibold text-secondary-800 mb-4">Permissions</h3>
            <div className="flex flex-col gap-2">
              {defaultPermissions.map((p) => (
                <div key={p} className="flex items-center justify-between p-4 border border-secondary-200 rounded-xl">
                  <span className="text-sm font-medium text-secondary-700">{p}</span>
                  <span className="text-xs font-semibold bg-success-bg text-success px-3 py-1 rounded-full">Active</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 mt-10 pt-6 border-t border-secondary-200">
          <button onClick={() => navigate(-1)}
            className="border border-secondary-200 text-secondary-600 text-sm px-6 py-2.5 rounded-xl hover:bg-secondary-100 transition-all cursor-pointer font-medium">
            Cancel
          </button>
          <button className="bg-primary-600 text-white text-sm px-6 py-2.5 rounded-xl hover:bg-primary-700 transition-all cursor-pointer flex items-center gap-2 font-medium shadow-sm">
            <FloppyDisk size={16} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}