import React, { useState, useMemo, useEffect } from 'react';
import {
  MagnifyingGlass, SlidersHorizontal, Funnel, Plus, CaretLeft, CaretRight,
  CaretDown, Check, Star, Eye, PencilSimple, Trash, List, PulseIcon
} from "../../icons/index";
import { Button } from '../../components/ui/Button';
import StatisticBlockShop from '../../components/shared/StatisticBlockShop';
import { StatisticBlockData } from '../../utilities/ShopUtilities';
import { Pagination } from '../../components/shared/Pagination';

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

const safeImage = (text) => `https://placehold.co/600x600/F5F5F8/A3A3B3?font=montserrat&text=${text}`;

const mockProducts = [
  { id: 1, title: 'Whey Isolate 2kg - Vanilla', category: 'PROTEIN', desc: 'Premium micro-filtered whey protein isolate for optimal recovery.', price: 59.99, stock: 45, status: 'IN STOCK', rating: 4.8, image: safeImage('WHEY+ISOLATE') },
  { id: 2, title: 'Daily Vitality vitamine Pack', category: 'VITAMINS', desc: 'Complete daily multivitamin pack for general health support.', price: 34.99, stock: 45, status: 'IN STOCK', rating: 4.8, image: safeImage('DAILY+VITALITY') },
  { id: 3, title: 'Pre workout "IGNITE"', category: 'PRE-WORKOUT', desc: 'Explosive energy and focus for intense training sessions.', price: 39.99, stock: 45, status: 'IN STOCK', rating: 4.8, image: safeImage('IGNITE') },
  { id: 4, title: 'Stainless Steel Shaker', category: 'ACCESSORIES', desc: 'Durable, odor-resistant stainless steel protein shaker bottle.', price: 19.99, stock: 45, status: 'IN STOCK', rating: 4.8, image: safeImage('SHAKER') },
  { id: 5, title: 'Creatine Monohydrate 500g', category: 'CREATINE', desc: 'Pure micronized creatine monohydrate for strength.', price: 29.99, stock: 10, status: 'LOW STOCK', rating: 4.6, image: safeImage('CREATINE') },
  { id: 6, title: 'BCAA Recovery Powder', category: 'AMINO ACIDS', desc: 'Intra-workout BCAA blend to reduce muscle fatigue.', price: 24.99, stock: 0, status: 'OUT OF STOCK', rating: 4.7, image: safeImage('BCAA') },
  { id: 7, title: 'Mass Gainer 5kg - Chocolate', category: 'PROTEIN', desc: 'High-calorie mass building formula with complex carbs.', price: 79.99, stock: 22, status: 'IN STOCK', rating: 4.5, image: safeImage('MASS+GAINER') },
  { id: 8, title: 'Gym Bag Duffel Medium', category: 'ACCESSORIES', desc: 'Spacious and breathable gym bag with shoe compartment.', price: 45.00, stock: 8, status: 'LOW STOCK', rating: 4.9, image: safeImage('GYM+BAG') },
  { id: 9, title: 'Weightlifting Belt L', category: 'EQUIPMENT', desc: 'Genuine leather heavy-duty lifting belt for back support.', price: 49.99, stock: 15, status: 'IN STOCK', rating: 4.8, image: safeImage('LIFTING+BELT') },
  { id: 10, title: 'Resistance Bands Set', category: 'EQUIPMENT', desc: 'Set of 5 resistance bands with varying tension levels.', price: 25.99, stock: 0, status: 'OUT OF STOCK', rating: 4.3, image: safeImage('BANDS') },
  { id: 11, title: 'Vegan Protein 1kg - Berry', category: 'PROTEIN', desc: 'Plant-based pea and rice protein blend.', price: 44.99, stock: 30, status: 'IN STOCK', rating: 4.4, image: safeImage('VEGAN+PRO') },
  { id: 12, title: 'Fish Oil Omega 3', category: 'VITAMINS', desc: 'High EPA/DHA omega 3 essential fatty acids.', price: 18.99, stock: 65, status: 'IN STOCK', rating: 4.7, image: safeImage('FISH+OIL') }
];

export default function Shop() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [category, setCategory] = useState('All');
  const [stockStatus, setStockStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDescId, setActiveDescId] = useState(null);
  const itemsPerPage = 4;

  useEffect(() => {
    const handleClickOutside = () => setActiveDescId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const statBlocks = [
    new StatisticBlockData({ title: 'Total Products', value: '1,248', bgColor: 'bg-primary-600', textColor: 'text-white', iconName: 'ClipboardText', iconColor: 'text-white', hasBgIcon: true }),
    new StatisticBlockData({ title: 'Low Stock Alerts', value: '24', badgeText: 'Action Required', badgeType: 'action', bgColor: 'bg-secondary-50', textColor: 'text-foreground', iconName: 'Warning', iconColor: 'text-secondary-200', hasBgIcon: false }),
    new StatisticBlockData({ title: 'Out of Stock', value: '12', badgeText: 'Urgent', badgeType: 'urgent', bgColor: 'bg-secondary-50', textColor: 'text-foreground', iconName: 'Package', iconColor: 'text-secondary-200', hasBgIcon: false }),
    new StatisticBlockData({ title: 'Shop Revenue (MTD)', value: '$14.2k', badgeText: '+12% vs LY', badgeType: 'positive', bgColor: 'bg-secondary-50', textColor: 'text-foreground', iconName: 'TrendUp', iconColor: 'text-secondary-200', hasBgIcon: false })
  ];

  const filteredProducts = useMemo(() => {
    let prods = [...mockProducts];
    if (search) prods = prods.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase()));
    if (category !== 'All') prods = prods.filter(p => p.category === category);
    if (stockStatus !== 'All') prods = prods.filter(p => p.status === stockStatus);
    if (sortBy === 'Price: Low to High') prods.sort((a, b) => a.price - b.price);
    else if (sortBy === 'Price: High to Low') prods.sort((a, b) => b.price - a.price);
    return prods;
  }, [search, sortBy, category, stockStatus]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) setCurrentPage(page);
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
    <div className='bg-secondary-100 min-h-dvh p-8'>

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
          <CustomSelect icon={<List size={18} className="text-secondary-400" />} options={['All', 'PROTEIN', 'PRE-WORKOUT', 'VITAMINS', 'EQUIPMENT', 'ACCESSORIES']} value={category} onChange={(val) => { setCategory(val); setCurrentPage(1); }} placeholder="Category" className="flex-1 z-20" />
        </div>

        <div className="relative z-40 flex items-center gap-3">
          <div className="flex-1">
            <CustomSelect icon={<PulseIcon size={18} className="text-secondary-400" />} options={['All', 'IN STOCK', 'LOW STOCK', 'OUT OF STOCK']} value={stockStatus} onChange={(val) => { setStockStatus(val); setCurrentPage(1); }} placeholder="Stock Status" className="w-full" />
          </div>
          <Button onClick={() => document.getElementById('global-search-input')?.focus()} className="h-11.5 flex items-center gap-2 px-4 rounded-xl text-primary-600 hover:bg-secondary-200 bg-transparent font-medium border-0 shadow-none transition-colors cursor-pointer shrink-0">
            <Funnel size={18} />
            Filter
          </Button>
        </div>

        <div className="flex justify-end gap-3 relative z-30">
          <Button className="h-11.5 px-6 whitespace-nowrap flex justify-center items-center gap-2 rounded-xl font-bold bg-primary-600 text-white hover:bg-primary-900 transition-colors shadow-[0_4px_12px_rgba(105,66,255,0.25)] ring-0 cursor-pointer active:scale-98">
            <Plus size={20} weight="bold" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 mb-8">
        {statBlocks.map((block, index) => (
          <StatisticBlockShop key={index} data={block} />
        ))}
      </div>

      <div className="overflow-hidden w-full relative pt-1 pb-6 -mb-6 -mx-2 px-2">
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform w-full"
          style={{ transform: `translateX(-${(currentPage - 1) * 100}%)` }}
        >
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <div key={pageIndex} className="w-full shrink-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage).map(product => (
                  <div key={product.id} className="bg-secondary-50 md:rounded-2xl xl:rounded-[20px] border border-secondary-200 hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer">
                    <div className="w-full h-60 relative bg-secondary-100 overflow-hidden md:rounded-t-2xl xl:rounded-t-[19px] mb-5 flex items-center justify-center shrink-0">
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider shadow-sm z-10 ${getStatusBadgeStyle(product.status)}`}>
                        {product.status}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col p-5">
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="text-primary-600 font-bold md:text-[12px] lg:text-[14px] tracking-widest uppercase">{product.category}</span>
                        <div className="flex items-center gap-1 md:text-[12px] lg:text-[14px] font-bold text-secondary-800">
                          <Star size={14} weight="fill" className="text-[#FACC15] mb-0.5" />
                          {product.rating}
                        </div>
                      </div>

                      <h4 className="md:text-[18px] lg:text-xl font-bold text-secondary-800 mb-1.5 leading-snug line-clamp-2 pr-4">{product.title}</h4>

                      <div className="relative z-20">
                        <p
                          className="text-secondary-500 md:text-[14px] lg:text-lg mb-5 line-clamp-1 cursor-pointer hover:text-primary-600 transition-colors"
                          onClick={(e) => { e.stopPropagation(); setActiveDescId(activeDescId === product.id ? null : product.id); }}
                        >
                          {product.desc}
                        </p>
                        {activeDescId === product.id && (
                          <div className="absolute left-0 bottom-full mb-2 w-[110%] md:w-[120%] bg-primary-600 text-white p-4 rounded-2xl shadow-[0_12px_30px_rgba(105,66,255,0.4)] z-50 text-sm font-medium animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-300 cursor-default" onClick={(e) => e.stopPropagation()}>
                            <div className="max-h-32 overflow-y-auto pr-2">{product.desc}</div>
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
                          <button className="w-11 h-11 flex justify-center items-center rounded-xl bg-error-bg text-error hover:bg-error hover:text-error-bg transition-all group/btn cursor-pointer active:scale-98">
                            <Trash size={20} className="group-hover/btn:scale-110 transition-transform duration-200" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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

    </div>
  );
}