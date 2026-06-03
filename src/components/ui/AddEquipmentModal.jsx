import { useState } from "react";
import { Button } from "./Button";
import { X } from "../../icons/index";
import { Barbell, ChartPie, CloudArrowUp, Calendar } from "@phosphor-icons/react";
import { api } from "../../services/api";

export default function AddEquipmentModal({ onClose, onEquipmentAdded }) {
  const [isClosing, setIsClosing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", category: "cardio", status: "available",
    description: "", image: null,
  });

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 300);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setForm({ ...form, image: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      if (form.description) formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("status", form.status);
      if (form.image) formData.append("image", form.image);

      await api.createEquipment(formData);
      if (onEquipmentAdded) onEquipmentAdded();
      handleClose();
    } catch (err) {
      setError(err.message || "Failed to create equipment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-end p-4">
      <div className={`bg-white w-[480px] h-[calc(100vh-32px)] shadow-2xl flex flex-col rounded-2xl transition-all duration-300 ${isClosing ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>

        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
          <div className="flex items-center gap-2">
            <Barbell size={20} className="text-secondary-600" />
            <h2 className="text-secondary-700 font-normal text-lg">Add Equipment</h2>
          </div>
          <button onClick={handleClose} className="text-secondary-400 hover:text-secondary-700 cursor-pointer transition-colors p-1.5 rounded-md hover:bg-secondary-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="flex flex-col gap-4">
              {error && (
                <div className="bg-error-bg text-error text-sm p-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Equipment Name</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-50 transition-all">
                  <Barbell size={16} className="text-secondary-300 shrink-0" />
                  <input name="name" placeholder="e.g. Treadmill Pro X1" value={form.name} onChange={handleChange} required
                    className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent" />
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-secondary-500 font-normal mb-2 block">Category</label>
                  <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                    <ChartPie size={16} className="text-secondary-300 shrink-0" />
                    <select name="category" value={form.category} onChange={handleChange}
                      className="w-full text-sm text-secondary-700 outline-none bg-transparent">
                      <option value="cardio">Cardio</option>
                      <option value="strength">Strength</option>
                      <option value="free_weights">Free Weights</option>
                      <option value="cables">Cables</option>
                      <option value="functional">Functional</option>
                    </select>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-xs text-secondary-500 font-normal mb-2 block">Status</label>
                  <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                    <Calendar size={16} className="text-secondary-300 shrink-0" />
                    <select name="status" value={form.status} onChange={handleChange}
                      className="w-full text-sm text-secondary-700 outline-none bg-transparent">
                      <option value="available">Available</option>
                      <option value="broken">Broken</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Description</label>
                <textarea name="description" placeholder="Equipment specifications, features, etc." value={form.description} onChange={handleChange} rows={3}
                  className="w-full border border-secondary-200 rounded-lg px-3 py-2.5 text-sm text-secondary-700 outline-none focus:border-primary-600 placeholder-secondary-300 resize-none transition-all" />
              </div>

              <div>
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Equipment Image</label>
                <div className="border-2 border-dashed border-secondary-200 rounded-xl p-6 text-center hover:border-primary-600 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <CloudArrowUp size={32} className="text-secondary-300" />
                    <p className="text-xs text-secondary-500">
                      {form.image ? form.image.name : "Choose an image or drag it here"}
                    </p>
                    <p className="text-xs text-secondary-300">JPG, PNG, WEBP up to 20MB</p>
                    <label className="mt-1 cursor-pointer">
                      <span className="border border-secondary-300 text-secondary-600 text-xs px-4 py-1.5 rounded-lg hover:bg-secondary-100 transition">Browse Image</span>
                      <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-secondary-200">
            <Button type="button" onClick={handleClose}
              className="border border-secondary-300 text-secondary-600 text-sm px-6 py-2.5 rounded-xl hover:bg-secondary-100 transition-all">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}
              className="bg-primary-600 text-white text-base font-medium px-6 py-2.5 rounded-xl hover:bg-primary-900 transition-all disabled:opacity-50">
              {submitting ? "Saving..." : "Add Equipment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
