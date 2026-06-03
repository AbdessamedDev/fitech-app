import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  MagnifyingGlass, SlidersHorizontal, Funnel, Plus, CaretDown, Check, Star, Eye, PencilSimple, Trash, List, PulseIcon
} from "../../icons/index";
import { Button } from '../../components/ui/Button';
import StatisticBlockShop from '../../components/shared/StatisticBlockShop';
import { StatisticBlockData } from '../../utilities/ShopUtilities';
import { Pagination } from '../../components/shared/Pagination';
import AddProductModal from '../../components/ui/AddProductModal';
import { api } from '../../services/api';

const SHOP_API = "http://localhost:5104";

function CustomSelect({ icon, options, value, onChange, placeholder, className }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} onBlur={handleBlur} tabIndex={0}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`h-[46px] flex items-center justify-between px-4 border rounded-xl bg-secondary-50 cursor-pointer shadow-[0_2px_4px_rgba(0,0,0,0.02)] transition-all duration-300 ${isOpen ? 'border-primary-600 ring-2 ring-primary-50' : 'border-secondary-200 hover:border-primary-300'}`}
      >
        <div className="flex items-center gap-2.5">
          {icon}
          <span className="text-[14px] font-medium text-secondary-700 select-none">
            {value === 'All' || value === 'Newest' ? placeholder : value}
          </span>
        </div>
        <CaretDown size={14} weight="bold" className={`text-secondary-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-[100] top-[54px] left-0 w-full bg-secondary-50 border border-border-light rounded-xl shadow-[0_12px_30px_rgba(0,0,0,0.12)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 origin-top">
          <div className="max-h-60 overflow-y-auto py-1.5">
            {options.map(opt => (
              <div
                key={opt}
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className={`px-4 py-2.5 text-[14px] cursor-pointer transition-colors flex items-center justify-between group ${value === opt ? 'bg-primary-50/50 text-primary-600 font-bold' : 'text-secondary-600 hover:bg-secondary-100 font-medium'}`}
              >
                {opt === 'All' || opt === 'Newest' ? placeholder : opt}
                {value === opt && <Check size={14} weight="bold" className="text-primary-600" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getStockStatus(stock) {
  if (stock === 0) return 'OUT OF STOCK';
  if (stock <= 5) return 'LOW STOCK';
  return 'IN STOCK';
}

export default function Shop() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [category, setCategory] = useState('All');
  const [stockStatus, setStockStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDescId, setActiveDescId] = useState(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const itemsPerPage = 4;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.listProducts();
      setProducts(data || []);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const handleClickOutside = () => setActiveDescId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const totalActive = products.filter(p => p.isActive !== false).length;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  const statBlocks = [
    new StatisticBlockData({ title: 'Total Products', value: String(totalActive), bgColor: 'bg-primary-600', textColor: 'text-white', iconName: 'ClipboardText', iconColor: 'text-white', hasBgIcon: true }),
    new StatisticBlockData({ title: 'Low Stock Alerts', value: String(lowStockCount), badgeText: 'Action Required', badgeType: 'action', bgColor: 'bg-secondary-50', textColor: 'text-foreground', iconName: 'Warning', iconColor: 'text-secondary-200', hasBgIcon: false }),
    new StatisticBlockData({ title: 'Out of Stock', value: String(outOfStockCount), badgeText: 'Urgent', badgeType: 'urgent', bgColor: 'bg-secondary-50', textColor: 'text-foreground', iconName: 'Package', iconColor: 'text-secondary-200', hasBgIcon: false }),
    new StatisticBlockData({ title: 'Shop Revenue (MTD)', value: '$0', badgeText: 'N/A', badgeType: 'positive', bgColor: 'bg-secondary-50', textColor: 'text-foreground', iconName: 'TrendUp', iconColor: 'text-secondary-200', hasBgIcon: false })
  ];

  const categoryOptions = ['All', 'supplements', 'clothing', 'accessories', 'other'];
  const stockOptions = ['All', 'IN STOCK', 'LOW STOCK', 'OUT OF STOCK'];

  const filteredProducts = useMemo(() => {
    let prods = [...products];
    if (search) {
      const q = search.toLowerCase();
      prods = prods.filter(p => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
    }
    if (category !== 'All') prods = prods.filter(p => p.category === category);
    if (stockStatus !== 'All') prods = prods.filter(p => getStockStatus(p.stock) === stockStatus);
    if (sortBy === 'Price: Low to High') prods.sort((a, b) => a.price - b.price);
    else if (sortBy === 'Price: High to Low') prods.sort((a, b) => b.price - a.price);
    return prods;
  }, [search, sortBy, category, stockStatus, products]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) setCurrentPage(page);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete product");
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'IN STOCK': return 'bg-[#E5F9E2] text-[#336D3B]';
      case 'LOW STOCK': return 'bg-[#FFF4E5] text-[#E65100]';
      case 'OUT OF STOCK': return 'bg-[#FDE5E1] text-[#BF3846]';
      default: return 'bg-secondary-200 text-secondary-600';
    }
  };

  return (
    <div className='bg-secondary-100 min-h-dvh p-8 max-w-420 mx-auto font-sans transition-all duration-300'>
      {showAddProductModal && (
        <AddProductModal onClose={() => setShowAddProductModal(false)} onProductAdded={fetchProducts} />
      )}

      <div className="relative z-60 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="relative">
          <MagnifyingGlass size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400" />
          <input
            id="global-search-input"
            placeholder="Search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="h-11.5 pl-11 w-full px-4 border border-secondary-200 rounded-xl bg-secondary-50 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-50 transition-all shadow-[0_2px_4px_rgba(0,0,0,0.02)] text-[14px] font-medium placeholder:text-secondary-400"
          />
        </div>

        <div className="flex gap-3">
          <CustomSelect icon={<SlidersHorizontal size={18} className="text-secondary-400" />} options={['Newest', 'Price: Low to High', 'Price: High to Low']} value={sortBy} onChange={(val) => { setSortBy(val); setCurrentPage(1); }} placeholder="Sort by" className="flex-1" />
          <CustomSelect icon={<List size={18} className="text-secondary-400" />} options={categoryOptions} value={category} onChange={(val) => { setCategory(val); setCurrentPage(1); }} placeholder="Category" className="flex-1 z-20" />
        </div>

        <div className="relative z-40 flex items-center gap-3">
          <div className="flex-1">
            <CustomSelect icon={<PulseIcon size={18} className="text-secondary-400" />} options={stockOptions} value={stockStatus} onChange={(val) => { setStockStatus(val); setCurrentPage(1); }} placeholder="Stock Status" className="w-full" />
          </div>
          <Button onClick={() => document.getElementById('global-search-input')?.focus()} className="h-11.5 flex items-center gap-2 px-4 rounded-xl text-primary-600 hover:bg-secondary-200 bg-transparent font-medium border-0 shadow-none transition-colors cursor-pointer shrink-0">
            <Funnel size={18} />
            Filter
          </Button>
        </div>

        <div className="flex justify-end gap-3 relative z-30">
          <Button
            onClick={() => setShowAddProductModal(true)}
            className="h-11.5 px-6 whitespace-nowrap flex justify-center items-center gap-2 rounded-xl font-bold bg-primary-600 text-white hover:bg-primary-900 transition-colors shadow-[0_4px_12px_rgba(105,66,255,0.25)] ring-0 cursor-pointer active:scale-98"
          >
            <Plus size={20} weight="bold" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        {statBlocks.map((block, index) => (
          <StatisticBlockShop key={index} data={block} />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-20">
          <p className="text-error text-lg font-medium mb-4">{error}</p>
          <Button onClick={fetchProducts} className="text-primary-600 underline">
            Try again
          </Button>
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-secondary-500 text-lg">No products found</p>
        </div>
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <>
          <div className="overflow-hidden w-full relative pt-1 pb-6 -mb-6 -mx-2 px-2">
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform w-full"
              style={{ transform: `translateX(-${(currentPage - 1) * 100}%)` }}
            >
              {Array.from({ length: totalPages }).map((_, pageIndex) => (
                <div key={pageIndex} className="w-full shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage).map(product => {
                      const status = getStockStatus(product.stock);
                      return (
                        <div key={product.id} className="bg-secondary-50 md:rounded-2xl xl:rounded-[20px] border border-secondary-200 hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer">
                          <div className="w-full h-60 relative bg-secondary-100 overflow-hidden md:rounded-t-2xl xl:rounded-t-[19px] mb-5 flex items-center justify-center shrink-0">
                            <img
                              src={product.imagePath ? `${SHOP_API}${product.imagePath}` : `https://placehold.co/600x600/F5F5F8/A3A3B3?font=montserrat&text=${encodeURIComponent(product.name)}`}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider shadow-sm z-10 ${getStatusBadgeStyle(status)}`}>
                              {status}
                            </div>
                          </div>

                          <div className="flex-1 flex flex-col p-5">
                            <div className="flex justify-between items-center mb-2.5">
                              <span className="text-primary-600 font-bold md:text-[12px] lg:text-[14px] tracking-widest uppercase">{product.category || "Other"}</span>
                            </div>

                            <h4 className="md:text-[18px] lg:text-xl font-bold text-secondary-800 mb-1.5 leading-snug line-clamp-2 pr-4">{product.name}</h4>

                            <div className="relative z-20">
                              <p
                                className="text-secondary-500 md:text-[14px] lg:text-lg mb-5 line-clamp-1 cursor-pointer hover:text-primary-600 transition-colors"
                                onClick={(e) => { e.stopPropagation(); setActiveDescId(activeDescId === product.id ? null : product.id); }}
                              >
                                {product.description || "No description"}
                              </p>
                              {activeDescId === product.id && (
                                <div className="absolute left-0 bottom-full mb-2 w-[110%] md:w-[120%] bg-primary-600 text-white p-4 rounded-2xl shadow-[0_12px_30px_rgba(105,66,255,0.4)] z-50 text-sm font-medium animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-300 cursor-default" onClick={(e) => e.stopPropagation()}>
                                  <div className="max-h-32 overflow-y-auto pr-2">{product.description || "No description"}</div>
                                  <div className="absolute left-6 -bottom-1.5 w-3 h-3 bg-primary-600 rotate-45"></div>
                                </div>
                              )}
                            </div>

                            <div className="mt-auto">
                              <div className="flex justify-between items-end border-t border-secondary-200 pt-5 mb-5">
                                <div className="md:text-2xl lg:text-[28px] leading-tight font-bold text-secondary-800">${product.price}</div>
                                <div className="text-right pb-1">
                                  <div className="text-[10px] text-secondary-500 font-bold uppercase tracking-wider mb-0.5">Stock Available</div>
                                  <div className="text-[14px] font-bold text-secondary-800">{product.stock} units</div>
                                </div>
                              </div>

                              <div className="flex justify-between w-full">
                                <div className="flex gap-2">
                                  <button className="w-11 h-11 flex justify-center items-center rounded-xl bg-bg-suspended text-suspended hover:bg-suspended hover:text-bg-suspended transition-all group/btn cursor-pointer active:scale-98">
                                    <Eye size={20} className="group-hover/btn:scale-110 transition-transform duration-200" />
                                  </button>
                                  <button className="w-11 h-11 flex justify-center items-center rounded-xl bg-bg-suspended text-suspended hover:bg-suspended hover:text-bg-suspended transition-all group/btn cursor-pointer active:scale-98">
                                    <PencilSimple size={20} className="group-hover/btn:scale-110 transition-transform duration-200" />
                                  </button>
                                </div>
                                <button
                                  onClick={() => handleDelete(product.id, product.name)}
                                  className="w-11 h-11 flex justify-center items-center rounded-xl bg-error-bg text-error hover:bg-error hover:text-error-bg transition-all group/btn cursor-pointer active:scale-98"
                                >
                                  <Trash size={20} className="group-hover/btn:scale-110 transition-transform duration-200" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="mt-10 mb-4 animate-in fade-in duration-500 delay-300">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
