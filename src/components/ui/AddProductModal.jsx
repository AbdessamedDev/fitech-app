 import { useState } from "react";
import { Button } from "./Button";
import { X } from "../../icons/index";
import {
  Barbell,
  ChartPie,
  Calendar,
  CloudArrowUp,
  Scan,
  CurrencyDollar,
  ChartLine,
  TrendUp,
  Heart,
  Tag,
  Stack,
} from "@phosphor-icons/react";

// MatrixLogo is not in @phosphor-icons/react, use this SVG inline instead
const MatrixLogoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
    <path d="M32 64v128M64 64v128M96 96v64M128 64v128M160 96v64M192 64v128M224 64v128" stroke="currentColor" strokeWidth="20" strokeLinecap="round" fill="none"/>
  </svg>
);

export default function AddProductModal({ onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const [form, setForm] = useState({
    name: "", category: "Protein", brand: "", sku: "", description: "",
    price: "", discountPrice: "", stockQuantity: "0", image: null,
    status: "In Stock", weight: "", flavor: "", expiryDate: "",
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
            <Barbell size={22} className="text-secondary-600" />
            <h2 className="text-secondary-700 font-normal text-xl">Add Product</h2>
          </div>
          <button onClick={handleClose} className="text-secondary-400 hover:text-secondary-700 cursor-pointer transition-colors p-1.5 rounded-md hover:bg-secondary-100">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-4">

            {/* Product Name — Barbell */}
            <div>
              <label className="text-xs text-secondary-500 font-normal mb-2 block">Enter Product Name</label>
              <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-50 transition-all">
                <Barbell size={22} className="text-secondary-300 shrink-0" />
                <input name="name" placeholder="eg. peloton v2" value={form.name} onChange={handleChange}
                  className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent" />
              </div>
            </div>

            {/* Category & Brand */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Select Category</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <ChartPie size={22} className="text-secondary-300 shrink-0" />
                  <select name="category" value={form.category} onChange={handleChange}
                    className="w-full text-sm text-secondary-700 outline-none bg-transparent">
                    <option value="Protein">Protein</option>
                    <option value="Vitamins">Vitamins</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>
              <div className="flex-1">
                {/* Brand — MatrixLogo */}
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Enter Brand</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <span className="text-secondary-300 shrink-0"><MatrixLogoIcon /></span>
                  <input name="brand" placeholder="Unbranded" value={form.brand} onChange={handleChange}
                    className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent" />
                </div>
              </div>
            </div>

            {/* SKU */}
            <div>
              <label className="text-xs text-secondary-500 font-normal mb-2 block">SKU / Product code</label>
              <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                <Scan size={22} className="text-secondary-300 shrink-0" />
                <input name="sku" placeholder="eg. peloton v2" value={form.sku} onChange={handleChange}
                  className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent" />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs text-secondary-500 font-normal mb-2 block">Description</label>
              <textarea name="description" placeholder="Enter the equipment specifications, features, etc." value={form.description} onChange={handleChange} rows={3}
                className="w-full border border-secondary-200 rounded-lg px-3 py-2.5 text-sm text-secondary-700 outline-none focus:border-primary-600 placeholder-secondary-300 resize-none transition-all" />
            </div>

            {/* Price, Discount, Stock */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Price</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <CurrencyDollar size={22} className="text-secondary-300 shrink-0" />
                  <input name="price" type="number" placeholder="0.00" value={form.price} onChange={handleChange}
                    className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent" />
                </div>
              </div>
              <div className="flex-1">
                {/* Discount Price — Tag */}
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Discount Price</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <Tag size={22} className="text-secondary-300 shrink-0" />
                  <input name="discountPrice" type="number" placeholder="Optional" value={form.discountPrice} onChange={handleChange}
                    className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent" />
                </div>
              </div>
              <div className="flex-1">
                {/* Stock Quantity — Stack */}
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Stock Quantity</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <Stack size={22} className="text-secondary-300 shrink-0" />
                  <input name="stockQuantity" type="number" placeholder="0" value={form.stockQuantity} onChange={handleChange}
                    className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent" />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-xs text-secondary-500 font-normal mb-2 block">Upload Product Image</label>
              <div className="border-2 border-dashed border-secondary-200 rounded-xl p-6 text-center hover:border-primary-600 transition-colors cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
                    <CloudArrowUp size={24} className="text-secondary-400" />
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

            {/* Status — ChartLine */}
            <div>
              <label className="text-xs text-secondary-500 font-normal mb-2 block">Status</label>
              <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                <ChartLine size={22} className="text-secondary-300 shrink-0" />
                <select name="status" value={form.status} onChange={handleChange}
                  className="w-full text-sm text-secondary-700 outline-none bg-transparent">
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Low Stock">Low Stock</option>
                </select>
              </div>
            </div>

            {/* Weight, Flavor, Expiry */}
            <div className="flex gap-3">
              <div className="flex-1">
                {/* Weight — TrendUp */}
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Weight</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <TrendUp size={22} className="text-secondary-300 shrink-0" />
                  <input name="weight" placeholder="eg. 2kg" value={form.weight} onChange={handleChange}
                    className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent" />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Flavor</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <Heart size={22} className="text-secondary-300 shrink-0" />
                  <input name="flavor" placeholder="Optional" value={form.flavor} onChange={handleChange}
                    className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent" />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs text-secondary-500 font-normal mb-2 block">Expiry Date</label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <Calendar size={22} className="text-secondary-300 shrink-0" />
                  <input name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange}
                    className="w-full text-sm text-secondary-700 outline-none bg-transparent" />
                </div>
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
            Add Product
          </Button>
        </div>
      </div>
    </div>
  );
}