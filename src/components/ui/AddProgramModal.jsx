import { useState } from "react";
import { Button } from "./Button";
import { X } from "../../icons/index";
import {
  Barbell,
  ChartPie,
  TrendUp,
  ChartLine,
  CloudArrowUp,
  MagnifyingGlass,
  Trash,
  Plus,
  Person,
  Clock,
  CalendarBlank,
  TextT,
} from "@phosphor-icons/react";

const mockExercises = [
  { id: 1, name: "Barbell Back Squat", type: "STRENGTH", sets: 4, reps: 12, rest: 90 },
  { id: 2, name: "Dumbbell Bench Press", type: "STRENGTH", sets: 3, reps: 10, rest: 60 },
  { id: 3, name: "Plank Hold", type: "CORE", sets: 3, reps: 45, rest: 30 },
];

const emptySession = () => ({
  id: Date.now(),
  day: "",
  startTime: "",
  endTime: "",
  description: "",
});

export default function AddProgramModal({ onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState(mockExercises);
  const [sessions, setSessions] = useState([emptySession()]);
  const [form, setForm] = useState({
    name: "", description: "", category: "Weight Loss", level: "Beginner",
    duration: "4 weeks", exerciseType: "Strength", image: null,
  });

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 300);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setForm({ ...form, image: e.target.files[0] });
  const removeExercise = (id) => setSelectedExercises(prev => prev.filter(e => e.id !== id));

  const addSession = () => setSessions(prev => [...prev, emptySession()]);
  const removeSession = (id) => setSessions(prev => prev.filter(s => s.id !== id));
  const updateSession = (id, field, value) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'STRENGTH': return 'text-yellow-600 bg-yellow-50';
      case 'CORE': return 'text-orange-600 bg-orange-50';
      case 'CARDIO': return 'text-blue-600 bg-blue-50';
      default: return 'text-secondary-600 bg-secondary-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-end p-4">
      <div className={`bg-white w-[480px] h-[calc(100vh-32px)] shadow-2xl flex flex-col rounded-2xl transition-all duration-300 ${isClosing ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
          <div className="flex items-center gap-2">
            <Barbell size={22} className="text-secondary-600" />
            <h2 className="text-secondary-700 font-normal text-xl">Add Program</h2>
          </div>
          <button onClick={handleClose} className="text-secondary-400 hover:text-secondary-700 cursor-pointer transition-colors p-1.5 rounded-md hover:bg-secondary-100">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-4">

            {/* Program Name */}
            <div>
              <label className="text-xs text-secondary-500 font-normal mb-2 block">Enter Program Name</label>
              <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-50 transition-all">
                <Barbell size={18} className="text-secondary-300 shrink-0" />
                <input name="name" placeholder="eg. Hypertrophy Blueprint" value={form.name} onChange={handleChange}
                  className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent" />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs text-secondary-500 font-normal mb-2 block">Add Description</label>
              <textarea name="description" placeholder="Enter program description and coaching notes ..." value={form.description} onChange={handleChange} rows={3}
                className="w-full border border-secondary-200 rounded-lg px-3 py-2.5 text-sm text-secondary-700 outline-none focus:border-primary-600 placeholder-secondary-300 resize-none transition-all" />
            </div>

            {/* Category & Level */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Category</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <Person size={18} className="text-secondary-300 shrink-0" />
                  <select name="category" value={form.category} onChange={handleChange}
                    className="w-full text-sm text-secondary-700 outline-none bg-transparent">
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Endurance">Endurance</option>
                    <option value="Flexibility">Flexibility</option>
                  </select>
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Level</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <TrendUp size={18} className="text-secondary-300 shrink-0" />
                  <select name="level" value={form.level} onChange={handleChange}
                    className="w-full text-sm text-secondary-700 outline-none bg-transparent">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Duration & Exercise Type */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Duration</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <Barbell size={18} className="text-secondary-300 shrink-0" />
                  <select name="duration" value={form.duration} onChange={handleChange}
                    className="w-full text-sm text-secondary-700 outline-none bg-transparent">
                    <option value="4 weeks">4 weeks</option>
                    <option value="8 weeks">8 weeks</option>
                    <option value="12 weeks">12 weeks</option>
                  </select>
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Exercise Type</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <ChartLine size={18} className="text-secondary-300 shrink-0" />
                  <select name="exerciseType" value={form.exerciseType} onChange={handleChange}
                    className="w-full text-sm text-secondary-700 outline-none bg-transparent">
                    <option value="Strength">Strength</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Flexibility">Flexibility</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-xs text-secondary-500 font-normal mb-2 block">Upload Program Image</label>
              <div className="border-2 border-dashed border-secondary-200 rounded-xl p-6 text-center hover:border-primary-600 transition-colors cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
                    <CloudArrowUp size={22} className="text-secondary-400" />
                  </div>
                  <p className="text-xs text-secondary-500">choose an image or drag an drop it here.</p>
                  <p className="text-xs text-secondary-300">PDF, Jpeg, Max up to 20MB</p>
                  <label className="mt-1 cursor-pointer">
                    <span className="border border-secondary-300 text-secondary-600 text-xs px-4 py-1.5 rounded-lg hover:bg-secondary-100 transition">Brows Image</span>
                    <input type="file" accept=".jpeg,.jpg,.png" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* Upload Exercises */}
            <div>
              <label className="text-xs text-secondary-500 font-normal mb-2 block">Upload Exercises</label>
              <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all mb-3">
                <MagnifyingGlass size={16} className="text-secondary-300 shrink-0" />
                <input placeholder="Search Exercise to add"
                  className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent" />
              </div>
              <div className="flex flex-col gap-2">
                {selectedExercises.map((exercise, index) => (
                  <div key={exercise.id} className="flex items-center gap-3 p-2.5 border border-secondary-200 rounded-xl">
                    <span className="text-xs text-secondary-300">⠿</span>
                    <div className="w-6 h-6 rounded-full bg-secondary-100 flex items-center justify-center shrink-0">
                      <span className="text-xs text-secondary-600 font-medium">{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-secondary-700 truncate">{exercise.name}</p>
                      <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${getTypeColor(exercise.type)}`}>{exercise.type}</span>
                    </div>
                    <div className="flex gap-2 text-xs text-secondary-400 shrink-0">
                      <span>SETS <span className="text-secondary-700 font-medium">{exercise.sets}</span></span>
                      <span>REPS <span className="text-secondary-700 font-medium">{exercise.reps}</span></span>
                      <span>REST <span className="text-secondary-700 font-medium">{exercise.rest}</span></span>
                    </div>
                    <button onClick={() => removeExercise(exercise.id)} className="text-secondary-300 hover:text-red-500 transition-colors cursor-pointer shrink-0">
                      <Trash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Sessions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-secondary-500 font-normal">Add Sessions</label>
                <button onClick={addSession}
                  className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-900 cursor-pointer transition-colors">
                  <Plus size={14} /> Add Session
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {sessions.map((session, index) => (
                  <div key={session.id} className="border border-secondary-200 rounded-xl p-3 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-secondary-600">Session {index + 1}</span>
                      {sessions.length > 1 && (
                        <button onClick={() => removeSession(session.id)} className="text-secondary-300 hover:text-red-500 cursor-pointer transition-colors">
                          <Trash size={14} />
                        </button>
                      )}
                    </div>

                    {/* Day */}
                    <div>
                      <label className="text-xs text-secondary-400 mb-1 block">Day</label>
                      <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-9 focus-within:border-primary-600 transition-all">
                        <CalendarBlank size={14} className="text-secondary-300 shrink-0" />
                        <select value={session.day} onChange={(e) => updateSession(session.id, 'day', e.target.value)}
                          className="w-full text-sm text-secondary-700 outline-none bg-transparent">
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
                          <input type="time" value={session.startTime} onChange={(e) => updateSession(session.id, 'startTime', e.target.value)}
                            className="w-full text-sm text-secondary-700 outline-none bg-transparent" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-secondary-400 mb-1 block">End Time</label>
                        <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-9 focus-within:border-primary-600 transition-all">
                          <Clock size={14} className="text-secondary-300 shrink-0" />
                          <input type="time" value={session.endTime} onChange={(e) => updateSession(session.id, 'endTime', e.target.value)}
                            className="w-full text-sm text-secondary-700 outline-none bg-transparent" />
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-xs text-secondary-400 mb-1 block">Description</label>
                      <div className="flex items-start border border-secondary-200 rounded-lg px-3 gap-2 focus-within:border-primary-600 transition-all pt-2">
                        <TextT size={14} className="text-secondary-300 shrink-0 mt-0.5" />
                        <textarea value={session.description} onChange={(e) => updateSession(session.id, 'description', e.target.value)}
                          placeholder="What will be done in this session..." rows={2}
                          className="w-full text-sm text-secondary-700 outline-none bg-transparent placeholder-secondary-300 resize-none" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-secondary-200">
          <Button onClick={handleClose} className="border border-secondary-300 text-secondary-600 text-sm px-6 py-2.5 rounded-xl hover:bg-secondary-100 transition-all">
            Cancel
          </Button>
          <Button onClick={() => { console.log(form, sessions); handleClose(); }} className="bg-primary-600 text-white text-base font-medium px-6 py-2.5 rounded-xl hover:bg-primary-900 transition-all">
            Add Program
          </Button>
        </div>
      </div>
    </div>
  );
}