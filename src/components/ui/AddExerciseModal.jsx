import { useState } from "react";
import { Button } from "./Button";
import { X } from "../../icons/index";
import {
  Barbell,
  ChartPie,
  CloudArrowUp,
  TrendUp,
  ChartLine,
  Tag,
  Stack,
  Heart,
  Calendar,
  Play,
  Plus,
  Scan,
  Lightning,
} from "@phosphor-icons/react";

const focusTags = ["Strength", "Upper Body", "Compound", "Push", "Free Weights", "Lower Body", "Core", "Cardio"];

export default function AddExerciseModal({ onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const [selectedTags, setSelectedTags] = useState(["Strength", "Upper Body"]);
  const [form, setForm] = useState({
    name: "", muscleGroup: "Chest", difficulty: "Beginner",
    equipment: "Barbell", exerciseType: "Strength",
    coachingNotes: "", sets: "0", reps: "0", rest: "0",
    image: null, videoUrl: "",
  });

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 300);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setForm({ ...form, image: e.target.files[0] });
  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-end p-4">
      <div className={`bg-white w-[480px] h-[calc(100vh-32px)] shadow-2xl flex flex-col rounded-2xl transition-all duration-300 ${isClosing ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
          <div className="flex items-center gap-2">
            <Lightning size={22} className="text-secondary-600" />
            <h2 className="text-secondary-700 font-normal text-xl">Add Exercise</h2>
          </div>
          <button onClick={handleClose} className="text-secondary-400 hover:text-secondary-700 cursor-pointer transition-colors p-1.5 rounded-md hover:bg-secondary-100">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-4">

            {/* Exercise Name */}
            <div>
              <label className="text-xs text-secondary-500 font-normal mb-2 block">Enter Exercise Name</label>
              <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-50 transition-all">
                <Barbell size={18} className="text-secondary-300 shrink-0" />
                <input name="name" placeholder="eg. pullups" value={form.name} onChange={handleChange}
                  className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent" />
              </div>
            </div>

            {/* Muscle Group & Difficulty */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Muscle Group</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <ChartPie size={18} className="text-secondary-300 shrink-0" />
                  <select name="muscleGroup" value={form.muscleGroup} onChange={handleChange}
                    className="w-full text-sm text-secondary-700 outline-none bg-transparent">
                    <option value="Chest">Chest</option>
                    <option value="Back">Back</option>
                    <option value="Legs">Legs</option>
                    <option value="Shoulders">Shoulders</option>
                    <option value="Arms">Arms</option>
                    <option value="Core">Core</option>
                  </select>
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Difficulty</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <TrendUp size={18} className="text-secondary-300 shrink-0" />
                  <select name="difficulty" value={form.difficulty} onChange={handleChange}
                    className="w-full text-sm text-secondary-700 outline-none bg-transparent">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Equipment & Exercise Type */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Equipment</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <Barbell size={18} className="text-secondary-300 shrink-0" />
                  <select name="equipment" value={form.equipment} onChange={handleChange}
                    className="w-full text-sm text-secondary-700 outline-none bg-transparent">
                    <option value="Barbell">Barbell</option>
                    <option value="Dumbbell">Dumbbell</option>
                    <option value="Bodyweight">Bodyweight</option>
                    <option value="Machine">Machine</option>
                    <option value="Cables">Cables</option>
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
                    <option value="Balance">Balance</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Coaching Notes */}
            <div>
              <label className="text-xs text-secondary-500 font-normal mb-2 block">Coaching Notes</label>
              <textarea name="coachingNotes" placeholder="Enter exercise steps and coaching notes ..." value={form.coachingNotes} onChange={handleChange} rows={3}
                className="w-full border border-secondary-200 rounded-lg px-3 py-2.5 text-sm text-secondary-700 outline-none focus:border-primary-600 placeholder-secondary-300 resize-none transition-all" />
            </div>

            {/* Sets, Reps, Rest */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Sets</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <Stack size={18} className="text-secondary-300 shrink-0" />
                  <input name="sets" type="number" placeholder="0" value={form.sets} onChange={handleChange}
                    className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent" />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Reps</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <Tag size={18} className="text-secondary-300 shrink-0" />
                  <input name="reps" type="number" placeholder="0" value={form.reps} onChange={handleChange}
                    className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent" />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Rest (sec)</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <Calendar size={18} className="text-secondary-300 shrink-0" />
                  <input name="rest" type="number" placeholder="0" value={form.rest} onChange={handleChange}
                    className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent" />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-xs text-secondary-500 font-normal mb-2 block">Upload Exercise Image</label>
              <div className="border-2 border-dashed border-secondary-200 rounded-xl p-6 text-center hover:border-primary-600 transition-colors cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
                    <CloudArrowUp size={22} className="text-secondary-400" />
                  </div>
                  <p className="text-xs text-secondary-500">choose an image or drag an drop it here.</p>
                  <p className="text-xs text-secondary-300">PDF, JPEG, Max up to 20MB</p>
                  <label className="mt-1 cursor-pointer">
                    <span className="border border-secondary-300 text-secondary-600 text-xs px-4 py-1.5 rounded-lg hover:bg-secondary-100 transition">Brows Image</span>
                    <input type="file" accept=".jpeg,.jpg,.png" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* Video Demo URL */}
            <div>
              <label className="text-xs text-secondary-500 font-normal mb-2 block">Video Demo URL</label>
              <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-50 transition-all">
                <Play size={18} className="text-secondary-300 shrink-0" />
                <input name="videoUrl" placeholder="https://youtube.com" value={form.videoUrl} onChange={handleChange}
                  className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent" />
              </div>
            </div>

            {/* Focus Tags */}
            <div>
              <label className="text-xs text-secondary-500 font-normal mb-2 block">Focus Tags</label>
              <div className="flex flex-wrap gap-2">
                {focusTags.map(tag => (
                  <button key={tag} onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 text-xs rounded-full border transition-all cursor-pointer ${
                      selectedTags.includes(tag)
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-secondary-600 border-secondary-300 hover:border-primary-600'
                    }`}>
                    {tag}
                  </button>
                ))}
                <button className="w-6 h-6 rounded-full border border-secondary-300 flex items-center justify-center text-secondary-400 hover:border-primary-600 transition-all cursor-pointer">
                  <Plus size={14} />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-secondary-200">
          <Button onClick={handleClose} className="border border-secondary-300 text-secondary-600 text-sm px-6 py-2.5 rounded-xl hover:bg-secondary-100 transition-all">
            Cancel
          </Button>
          <Button onClick={() => { console.log(form); handleClose(); }} className="bg-primary-600 text-white text-base font-medium px-6 py-2.5 rounded-xl hover:bg-primary-900 transition-all">
            Add Exercise
          </Button>
        </div>
      </div>
    </div>
  );
}