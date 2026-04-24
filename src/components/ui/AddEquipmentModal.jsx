import { useState } from "react";
import { Button } from "./Button";
import { X } from "../../icons/index";
import { Barbell, ChartBarHorizontal, ChartPie, Calendar, CloudArrowUp, QrCode, Scan } from "@phosphor-icons/react";

export default function AddEquipmentModal({ onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const [generateQr, setGenerateQr] = useState(true);
  const [form, setForm] = useState({
    name: "", category: "Cardio", status: "Available",
    description: "", purchaseDate: "", maintenanceDate: "",
    image: null, equipmentId: "EQ-2024-8842",
  });

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 300);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setForm({ ...form, image: e.target.files[0] });

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-end p-4">
      <div className={`bg-white w-[480px] h-[calc(100vh-32px)] shadow-2xl flex flex-col rounded-2xl transition-all duration-300 ${isClosing ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
          <div className="flex items-center gap-2">
            <Barbell size={20} className="text-secondary-600" />
            <h2 className="text-secondary-700 font-normal text-lg">Add Equipment</h2>
          </div>
          <button onClick={handleClose} className="text-secondary-400 hover:text-secondary-700 cursor-pointer transition-colors p-1.5 rounded-md hover:bg-secondary-100">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-4">

            {/* Equipment Name */}
            <div>
              <label className="text-xs text-secondary-500 font-normal mb-2 block">Enter Equipment Name</label>
              <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-50 transition-all">
                <Barbell size={16} className="text-secondary-300 shrink-0" />
                <input name="name" placeholder="eg. peloton x2" value={form.name} onChange={handleChange}
                  className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent" />
              </div>
            </div>

            {/* Category & Status */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Select Category</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <ChartPie size={16} className="text-secondary-300 shrink-0" />
                  <select name="category" value={form.category} onChange={handleChange}
                    className="w-full text-sm text-secondary-700 outline-none bg-transparent">
                    <option value="Cardio">Cardio</option>
                    <option value="Strength">Strength</option>
                    <option value="Flexibility">Flexibility</option>
                  </select>
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Select Status</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <ChartBarHorizontal size={16} className="text-secondary-300 shrink-0" />
                  <select name="status" value={form.status} onChange={handleChange}
                    className="w-full text-sm text-secondary-700 outline-none bg-transparent">
                    <option value="Available">Available</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Out of Service">Out of Service</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs text-secondary-500 font-normal mb-2 block">Description</label>
              <textarea name="description" placeholder="Enter the equipment specifications, features, etc." value={form.description} onChange={handleChange} rows={3}
                className="w-full border border-secondary-200 rounded-lg px-3 py-2.5 text-sm text-secondary-700 outline-none focus:border-primary-600 placeholder-secondary-300 resize-none transition-all" />
            </div>

            {/* Purchase & Maintenance Date */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Purchase Date</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <Calendar size={16} className="text-secondary-300 shrink-0" />
                  <input name="purchaseDate" type="date" value={form.purchaseDate} onChange={handleChange}
                    className="w-full text-sm text-secondary-700 outline-none bg-transparent" />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Last Maintenance Date</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <Calendar size={16} className="text-secondary-300 shrink-0" />
                  <input name="maintenanceDate" type="date" value={form.maintenanceDate} onChange={handleChange}
                    className="w-full text-sm text-secondary-700 outline-none bg-transparent" />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-xs text-secondary-500 font-normal mb-2 block">Upload Equipment Image</label>
              <div className="border-2 border-dashed border-secondary-200 rounded-xl p-6 text-center hover:border-primary-600 transition-colors cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <CloudArrowUp size={32} className="text-secondary-300" />
                  <p className="text-xs text-secondary-500">choose an image or drag an drop it here.</p>
                  <p className="text-xs text-secondary-300">PDF, JPEG, Max up to 20MB</p>
                  <label className="mt-1 cursor-pointer">
                    <span className="border border-secondary-300 text-secondary-600 text-xs px-4 py-1.5 rounded-lg hover:bg-secondary-100 transition">Browse Image</span>
                    <input type="file" accept=".jpeg,.jpg,.png" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="border border-secondary-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <QrCode size={18} className="text-primary-600" />
                  <span className="text-sm font-semibold text-secondary-700">QR Code Section</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-secondary-500">Generate automatically</span>
                  <button onClick={() => setGenerateQr(!generateQr)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${generateQr ? 'bg-primary-600' : 'bg-secondary-300'}`}>
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${generateQr ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-xs text-secondary-400 font-medium mb-1.5">EQUIPMENT ID</p>
                  <div className="flex items-center border border-secondary-200 rounded-lg px-3 h-10 bg-secondary-50">
                    <span className="text-sm text-primary-600 font-semibold">{form.equipmentId}</span>
                  </div>
                  <button className="mt-2 w-full border border-primary-600 text-primary-600 text-sm py-2 rounded-lg hover:bg-primary-50 transition font-medium">
                    Generate QR Code
                  </button>
                </div>
                <div className="w-20 h-20 border-2 border-dashed border-secondary-200 rounded-lg flex flex-col items-center justify-center bg-secondary-50 shrink-0 mt-5">
                  <Scan size={28} className="text-secondary-300" />
                  <p className="text-xs text-secondary-300 mt-1 text-center">PREV<br/>IEW</p>
                </div>
              </div>
              <p className="text-xs text-secondary-400 mt-3">QR code will be attached to this equipment for easy tracking via mobile app.</p>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-secondary-200">
          <Button onClick={handleClose} className="border border-secondary-300 text-secondary-600 text-sm px-6 py-2.5 rounded-xl hover:bg-secondary-100 transition-all">
            Cancel
          </Button>
          <Button onClick={() => { console.log(form); handleClose(); }} className="bg-primary-600 text-white text-base font-medium px-6 py-2.5 rounded-xl hover:bg-primary-900 transition-all">
            Add Equipment
          </Button>
        </div>
      </div>
    </div>
  );
}