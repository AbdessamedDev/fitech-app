import { useState } from "react";
import { Button } from "./Button";
import { X } from "../../icons/index";
import {
  Barbell,
  ChartPie,
  CloudArrowUp,
  CurrencyDollar,
  Stack,
} from "@phosphor-icons/react";
import { api } from "../../services/api";

export default function AddProductModal({ onClose, onProductAdded }) {
  const [isClosing, setIsClosing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    category: "supplements",
    description: "",
    price: "",
    stock: "0",
    image: null,
  });

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 300);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) =>
    setForm({ ...form, image: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      if (form.description) formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("stock", form.stock);
      if (form.image) formData.append("image", form.image);

      await api.createProduct(formData);
      if (onProductAdded) onProductAdded();
      handleClose();
    } catch (err) {
      setError(err.message || "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-100 flex items-center justify-end p-4">
      <div
        className={`bg-white w-[480px] h-[calc(100vh-32px)] shadow-2xl flex flex-col rounded-2xl transition-all duration-300 ${isClosing ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
          <div className="flex items-center gap-2">
            <Barbell size={22} className="text-secondary-600" />
            <h2 className="text-secondary-700 font-normal text-xl">
              Add Product
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-secondary-400 hover:text-secondary-700 cursor-pointer transition-colors p-1.5 rounded-md hover:bg-secondary-100"
          >
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
                <label className="text-xs text-secondary-500 font-normal mb-2 block">
                  Product Name
                </label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-50 transition-all">
                  <Barbell size={22} className="text-secondary-300 shrink-0" />
                  <input
                    name="name"
                    placeholder="e.g. Whey Protein"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-secondary-500 font-normal mb-2 block">
                  Category
                </label>
                <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                  <ChartPie size={22} className="text-secondary-300 shrink-0" />
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full text-sm text-secondary-700 outline-none bg-transparent"
                  >
                    <option value="supplements">Supplements</option>
                    <option value="clothing">Clothing</option>
                    <option value="accessories">Accessories</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-secondary-500 font-normal mb-2 block">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Product description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-secondary-200 rounded-lg px-3 py-2.5 text-sm text-secondary-700 outline-none focus:border-primary-600 placeholder-secondary-300 resize-none transition-all"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-secondary-500 font-normal mb-2 block">
                    Price
                  </label>
                  <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                    <CurrencyDollar
                      size={22}
                      className="text-secondary-300 shrink-0"
                    />
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={form.price}
                      onChange={handleChange}
                      required
                      className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-xs text-secondary-500 font-normal mb-2 block">
                    Stock
                  </label>
                  <div className="flex items-center border border-secondary-200 rounded-lg px-3 gap-2 h-10 focus-within:border-primary-600 transition-all">
                    <Stack
                      size={22}
                      className="text-secondary-300 shrink-0"
                    />
                    <input
                      name="stock"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={form.stock}
                      onChange={handleChange}
                      className="w-full text-sm outline-none text-secondary-700 placeholder-secondary-300 bg-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-secondary-500 font-normal mb-2 block">
                  Product Image
                </label>
                <div className="border-2 border-dashed border-secondary-200 rounded-xl p-6 text-center hover:border-primary-600 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
                      <CloudArrowUp
                        size={24}
                        className="text-secondary-400"
                      />
                    </div>
                    <p className="text-xs text-secondary-500">
                      {form.image
                        ? form.image.name
                        : "Choose an image or drag it here"}
                    </p>
                    <p className="text-xs text-secondary-300">
                      JPG, PNG, WEBP up to 20MB
                    </p>
                    <label className="mt-1 cursor-pointer">
                      <span className="border border-secondary-300 text-secondary-600 text-xs px-4 py-1.5 rounded-lg hover:bg-secondary-100 transition">
                        Browse Image
                      </span>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-secondary-200">
            <Button
              type="button"
              onClick={handleClose}
              className="border border-secondary-300 text-secondary-600 text-sm px-6 py-2.5 rounded-xl hover:bg-secondary-100 transition-all"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-primary-600 text-white text-base font-medium px-6 py-2.5 rounded-xl hover:bg-primary-900 transition-all disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Add Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
