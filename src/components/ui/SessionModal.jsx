import { useState } from "react";
import { X, Check, Warning, MapPin, Clock } from "@phosphor-icons/react";
import jsPDF from "jspdf";

export default function SessionModal({ session, onClose }) {
  const [attendance, setAttendance] = useState(() => {
    const init = {};
    session.members.forEach((m) => { init[m.id] = null; });
    return init;
  });

  const toggleAttendance = (memberId, value) => {
    setAttendance((prev) => ({
      ...prev,
      [memberId]: prev[memberId] === value ? null : value,
    }));
  };

  const absentMembers = session.members.filter((m) => attendance[m.id] === "absent");
  const presentMembers = session.members.filter((m) => attendance[m.id] === "present");

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Absent Members Report", 20, 20);

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Session: ${session.name}`, 20, 35);
    doc.text(`Type: ${session.type || "—"}`, 20, 43);
    doc.text(`Time: ${session.time || "—"}`, 20, 51);
    doc.text(`Location: ${session.location || "Online"}`, 20, 59);

    doc.setDrawColor(200, 200, 200);
    doc.line(20, 65, 190, 65);

    doc.setFontSize(13);
    doc.setTextColor(180, 50, 50);
    doc.text(`Absent Members (${absentMembers.length})`, 20, 75);

    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    if (absentMembers.length === 0) {
      doc.text("No absent members.", 20, 85);
    } else {
      absentMembers.forEach((m, i) => {
        doc.text(`${i + 1}. ${m.name}`, 25, 85 + i * 10);
      });
    }

    const afterAbsent = 85 + absentMembers.length * 10 + 10;
    doc.setFontSize(13);
    doc.setTextColor(30, 130, 80);
    doc.text(`Present Members (${presentMembers.length})`, 20, afterAbsent);

    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    if (presentMembers.length === 0) {
      doc.text("No present members marked.", 20, afterAbsent + 10);
    } else {
      presentMembers.forEach((m, i) => {
        doc.text(`${i + 1}. ${m.name}`, 25, afterAbsent + 10 + i * 10);
      });
    }

    doc.save(`absent-${session.name.replace(/\s+/g, "-")}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-[500px] max-h-[85vh] flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-secondary-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-secondary-200 shrink-0">
              <img
                src="/coach.jpg"
                alt="coach"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = `<span class="w-full h-full flex items-center justify-center text-white font-bold text-sm bg-primary-600">${session.name[0]}</span>`;
                }}
              />
            </div>
            <div>
              <h2 className="text-base font-bold text-secondary-800">{session.name}</h2>
              <p className="text-xs text-secondary-400 mt-0.5">{session.type}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-secondary-700 cursor-pointer p-1.5 rounded-lg hover:bg-secondary-100 transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">

          {/* Session Info */}
          <div className="flex gap-4 mb-5 p-3 bg-secondary-50 rounded-xl border border-secondary-200">
            <div className="flex items-center gap-2 text-sm text-secondary-600">
              <Clock size={15} className="text-primary-600" />
              <span>{session.time}</span>
            </div>
            {session.location && (
              <div className="flex items-center gap-2 text-sm text-secondary-600">
                <MapPin size={15} className="text-primary-600" />
                <span>{session.location}</span>
              </div>
            )}
          </div>

          {/* Members */}
          <p className="text-xs font-bold text-secondary-400 uppercase tracking-widest mb-3">
            Enrolled Members ({session.members.length})
          </p>
          <div className="flex flex-col gap-2 mb-4">
            {session.members.map((member) => (
              <div
                key={member.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  attendance[member.id] === "present"
                    ? "border-green-200 bg-green-50"
                    : attendance[member.id] === "absent"
                    ? "border-red-200 bg-red-50"
                    : "border-secondary-200 bg-white"
                }`}>
                <div className={`w-9 h-9 rounded-full overflow-hidden ${member.avatarColor} flex items-center justify-center shrink-0`}>
                  <img
                    src="/coach.jpg"
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML = `<span class="text-white text-sm font-bold">${member.avatar}</span>`;
                    }}
                  />
                </div>
                <p className="text-sm font-medium text-secondary-700 flex-1">{member.name}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAttendance(member.id, "present")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      attendance[member.id] === "present"
                        ? "bg-green-500 text-white border-green-500"
                        : "border-secondary-200 text-secondary-500 hover:border-green-300 hover:text-green-600"
                    }`}>
                    <Check size={12} /> Present
                  </button>
                  <button
                    onClick={() => toggleAttendance(member.id, "absent")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      attendance[member.id] === "absent"
                        ? "bg-red-500 text-white border-red-500"
                        : "border-secondary-200 text-secondary-500 hover:border-red-300 hover:text-red-600"
                    }`}>
                    <X size={12} /> Absent
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Absent Summary */}
          {absentMembers.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Warning size={16} className="text-red-500" />
                <p className="text-sm font-bold text-red-600">
                  Absent Members — {absentMembers.length}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                {absentMembers.map((m) => (
                  <div key={m.id} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    <p className="text-sm text-red-600">{m.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-secondary-200">
          <button
            onClick={exportPDF}
            disabled={absentMembers.length === 0}
            className="flex items-center gap-2 border border-secondary-200 text-secondary-600 text-sm px-4 py-2 rounded-xl hover:bg-secondary-100 transition-all cursor-pointer font-medium disabled:opacity-40 disabled:cursor-not-allowed">
            📄 Export Absent List PDF
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="border border-secondary-200 text-secondary-600 text-sm px-5 py-2 rounded-xl hover:bg-secondary-100 transition-all cursor-pointer">
              Close
            </button>
            <button className="bg-primary-600 text-white text-sm px-5 py-2 rounded-xl hover:bg-primary-900 transition-all cursor-pointer font-medium">
              Save Attendance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}