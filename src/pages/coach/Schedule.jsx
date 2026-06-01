import { useState } from "react";
import { CaretLeft, CaretRight, CalendarBlank, MapPin, Clock } from "@phosphor-icons/react";
import SessionModal from "../../components/ui/SessionModal";

const DAYS_BASE = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const HOURS = ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

const WEEKS = [
  {
    label: "May 8 — 14, 2024",
    dates: [8, 9, 10, 11, 12, 13, 14],
    todayIndex: -1,
    sessions: [
      { id: 7, day: 9, hour: 8, name: "Flex Wheeler", type: "Cardio Session", location: "City Gym", time: "08:00 - 09:00", color: "bg-[#FFF3F3] border border-[#FECACA] text-[#B91C1C]", category: "coaching", members: [{ id: 1, name: "Flex Wheeler", avatar: "F", avatarColor: "bg-[#A78BFA]" }, { id: 2, name: "Tom Platz", avatar: "T", avatarColor: "bg-[#60A5FA]" }] },
    ],
    todaySessions: [
      { id: 7, name: "Flex Wheeler", time: "08:00", sub: "Cardio Session", tag: null, status: null, avatar: "F", avatarColor: "bg-[#A78BFA]" },
    ],
  },
  {
    label: "May 15 — 21, 2024",
    dates: [15, 16, 17, 18, 19, 20, 21],
    todayIndex: 2,
    sessions: [
      { id: 1, day: 15, hour: 8, name: "David Goggins", type: "Personal Training", location: "Elite Gym", time: "08:00 - 09:00", color: "bg-[#FFF3F3] border border-[#FECACA] text-[#B91C1C]", category: "coaching", members: [{ id: 1, name: "David Goggins", avatar: "D", avatarColor: "bg-[#F87171]" }, { id: 2, name: "Mike Johnson", avatar: "M", avatarColor: "bg-[#60A5FA]" }, { id: 3, name: "Sarah Lee", avatar: "S", avatarColor: "bg-[#A78BFA]" }] },
      { id: 2, day: 16, hour: 10, name: "Chris Bumstead", type: "Consultation", location: "Online", time: "10:00 - 11:00", status: "Done", color: "bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D]", category: "consultation", members: [{ id: 1, name: "Chris Bumstead", avatar: "C", avatarColor: "bg-[#4ADE80]" }] },
      { id: 3, day: 18, hour: 9, name: "Ronnie Coleman", type: "Check-in", location: "", time: "09:00 - 09:30", color: "bg-secondary-100 border-l-4 border-secondary-300 text-secondary-500", category: "checkin", members: [{ id: 1, name: "Ronnie Coleman", avatar: "R", avatarColor: "bg-[#94A3B8]" }, { id: 2, name: "Tom Hardy", avatar: "T", avatarColor: "bg-[#FCD34D]" }] },
      { id: 4, day: 19, hour: 7, name: "Arnold S.", type: "Personal Training", location: "Gold's Gym", time: "17:00 - 18:30", color: "bg-[#FFF3F3] border border-[#FECACA] text-[#B91C1C]", category: "coaching", members: [{ id: 1, name: "Arnold S.", avatar: "A", avatarColor: "bg-[#FB923C]" }, { id: 2, name: "Lou Ferrigno", avatar: "L", avatarColor: "bg-[#F87171]" }] },
    ],
    todaySessions: [
      { id: 1, name: "David Goggins", time: "08:00", sub: "Lower Body", tag: "Strength", tagColor: "text-[#B91C1C] bg-[#FFF3F3]", status: null, avatar: "D", avatarColor: "bg-[#F87171]" },
      { id: 2, name: "Chris Bumstead", time: "10:00", sub: "Monthly Progress", tag: null, status: null, avatar: "C", avatarColor: "bg-[#4ADE80]" },
      { id: 3, name: "Ronnie Coleman", time: "14:00", sub: "Cancelled", tag: null, status: "cancelled", avatar: "R", avatarColor: "bg-[#94A3B8]" },
      { id: 4, name: "Arnold S.", time: "17:00", sub: "Posing Routine", tag: null, status: null, avatar: "A", avatarColor: "bg-[#FB923C]" },
    ],
  },
  {
    label: "May 22 — 28, 2024",
    dates: [22, 23, 24, 25, 26, 27, 28],
    todayIndex: -1,
    sessions: [
      { id: 5, day: 22, hour: 9, name: "Phil Heath", type: "Strength Training", location: "Iron Gym", time: "09:00 - 10:30", color: "bg-[#FFF3F3] border border-[#FECACA] text-[#B91C1C]", category: "coaching", members: [{ id: 1, name: "Phil Heath", avatar: "P", avatarColor: "bg-[#F87171]" }] },
      { id: 6, day: 24, hour: 11, name: "Jay Cutler", type: "Consultation", location: "Online", time: "11:00 - 12:00", color: "bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D]", category: "consultation", members: [{ id: 1, name: "Jay Cutler", avatar: "J", avatarColor: "bg-[#4ADE80]" }] },
    ],
    todaySessions: [
      { id: 5, name: "Phil Heath", time: "09:00", sub: "Strength Training", tag: null, status: null, avatar: "P", avatarColor: "bg-[#F87171]" },
      { id: 6, name: "Jay Cutler", time: "11:00", sub: "Consultation", tag: null, status: null, avatar: "J", avatarColor: "bg-[#4ADE80]" },
    ],
  },
];

export default function Schedule() {
  const [view, setView] = useState("Week");
  const [weekIndex, setWeekIndex] = useState(1);
  const [selectedSession, setSelectedSession] = useState(null);

  const currentWeek = WEEKS[weekIndex];

  return (
    <div className="flex overflow-hidden bg-secondary-100" style={{ height: "calc(100vh - 56px)" }}>

      {selectedSession && (
        <SessionModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}

      {/* Main Calendar */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Toolbar */}
        <div className="bg-secondary-50 border-b border-secondary-200 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1 bg-secondary-100 rounded-lg p-1">
            {["Day", "Week", "Month"].map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                  view === v ? "bg-secondary-50 text-secondary-700 shadow-sm" : "text-secondary-400 hover:text-secondary-600"
                }`}>
                {v}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setWeekIndex((i) => Math.max(i - 1, 0))}
              disabled={weekIndex === 0}
              className="p-1.5 rounded-lg hover:bg-secondary-100 transition-all cursor-pointer text-secondary-500 disabled:opacity-30">
              <CaretLeft size={16} />
            </button>
            <span className="text-sm font-semibold text-secondary-700 w-44 text-center">
              {currentWeek.label}
            </span>
            <button
              onClick={() => setWeekIndex((i) => Math.min(i + 1, WEEKS.length - 1))}
              disabled={weekIndex === WEEKS.length - 1}
              className="p-1.5 rounded-lg hover:bg-secondary-100 transition-all cursor-pointer text-secondary-500 disabled:opacity-30">
              <CaretRight size={16} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            {[
              { label: "Coaching", color: "bg-[#F87171]" },
              { label: "Consultation", color: "bg-[#4ADE80]" },
              { label: "Check-in", color: "bg-[#94A3B8]" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-xs text-secondary-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-auto">
          <div className="min-w-max">
            <div className="grid sticky top-0 z-10 bg-secondary-50 border-b border-secondary-200"
              style={{ gridTemplateColumns: "72px repeat(7, minmax(130px, 1fr))" }}>
              <div className="py-3" />
              {DAYS_BASE.map((label, i) => {
                const date = currentWeek.dates[i];
                const isToday = currentWeek.todayIndex === i;
                return (
                  <div key={label} className="py-3 text-center border-l border-secondary-200">
                    <p className="text-xs text-secondary-400 font-medium tracking-widest">{label}</p>
                    <div className={`mx-auto mt-1 w-8 h-8 rounded-full flex items-center justify-center ${isToday ? "bg-primary-600" : ""}`}>
                      <p className={`text-sm font-bold ${isToday ? "text-white" : "text-secondary-700"}`}>{date}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {HOURS.map((hour) => {
              const hourNum = parseInt(hour);
              return (
                <div key={hour} className="grid border-b border-secondary-200"
                  style={{ gridTemplateColumns: "72px repeat(7, minmax(130px, 1fr))" }}>
                  <div className="py-5 pr-3 text-right shrink-0">
                    <span className="text-xs text-secondary-400">{hour}</span>
                  </div>
                  {currentWeek.dates.map((date) => {
                    const session = currentWeek.sessions.find(s => s.day === date && s.hour === hourNum);
                    return (
                      <div key={date} className="border-l border-secondary-200 p-1.5 min-h-[80px]">
                        {session && (
                          <div
                            onClick={() => setSelectedSession(session)}
                            className={`rounded-xl p-2.5 text-xs cursor-pointer h-full hover:opacity-80 transition-opacity ${session.color}`}>
                            <p className="font-semibold truncate">{session.name}</p>
                            {session.type && <p className="opacity-70 truncate mt-0.5">{session.type}</p>}
                            {session.location && (
                              <div className="flex items-center gap-1 mt-1.5 opacity-70">
                                <MapPin size={10} /><span className="truncate">{session.location}</span>
                              </div>
                            )}
                            {session.time && (
                              <div className="flex items-center gap-1 mt-1 opacity-70">
                                <Clock size={10} /><span>{session.time}</span>
                              </div>
                            )}
                            {session.status && (
                              <span className="inline-block mt-1.5 bg-white/70 px-2 py-0.5 rounded-md font-medium">
                                {session.status}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-72 shrink-0 bg-secondary-50 border-l border-secondary-200 flex flex-col">
        <div className="px-5 py-4 border-b border-secondary-200 flex items-center justify-between">
          <p className="text-sm font-semibold text-secondary-700">Today's sessions</p>
          <span className="text-xs font-bold bg-primary-600 text-white px-2.5 py-1 rounded-full">
            {currentWeek.todaySessions.filter(s => s.status !== "cancelled").length} Slots
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
          {currentWeek.todaySessions.map((s) => (
            <div key={s.id}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                s.status === "cancelled"
                  ? "border-secondary-200 opacity-50"
                  : "border-secondary-200 hover:border-primary-200 hover:bg-primary-50"
              }`}>
              <div className={`w-9 h-9 rounded-full overflow-hidden ${s.avatarColor} flex items-center justify-center shrink-0 relative`}>
                <img src="/coach.jpg" alt={s.name} className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = "none"; }} />
                {s.status === "cancelled" && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${s.status === "cancelled" ? "line-through text-secondary-400" : "text-secondary-700"}`}>
                  {s.name}
                </p>
                <p className="text-xs text-secondary-400 truncate">{s.time} • {s.sub}</p>
              </div>
              {s.tag && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${s.tagColor}`}>
                  {s.tag}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="px-4 py-4 border-t border-secondary-200">
          <button className="w-full flex items-center justify-center gap-2 border border-secondary-200 text-secondary-600 text-sm py-2.5 rounded-xl hover:bg-secondary-100 transition-all cursor-pointer font-medium">
            <CalendarBlank size={16} />
            Quick Add Slot
          </button>
        </div>
      </div>
    </div>
  );
}