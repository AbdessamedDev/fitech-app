import React, { useState, useMemo } from 'react';
import { 
  MagnifyingGlass, SlidersHorizontal, Funnel, Plus, CaretLeft, CaretRight, CarProfile, 
  CaretDown, Check, Star, Eye, PencilSimple, Trash
} from "../../icons/index";
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import StatisticBlockShop from '../../components/shared/StatisticBlockShop';
import { StatisticBlockData } from '../../utilities/ShopUtilities';

// Mock Data for Products
const mockProducts = [
  { id: 1, title: 'Whey Isolate 2kg - Vanilla', category: 'PROTEIN', desc: 'Premium micro-filtered whey protein isolate for optimal recovery.', price: 59.99, stock: 45, status: 'IN STOCK', rating: 4.8, image: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 2, title: 'Daily Vitality vitamine Pack', category: 'VITAMINS', desc: 'Complete daily multivitamin pack for general health support.', price: 34.99, stock: 45, status: 'IN STOCK', rating: 4.8, image: 'https://images.unsplash.com/photo-1628770281358-0056157121b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 3, title: 'Pre workout "IGNITE"', category: 'PRE-WORKOUT', desc: 'Explosive energy and focus for intense training sessions.', price: 39.99, stock: 45, status: 'IN STOCK', rating: 4.8, image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 4, title: 'Stainless Steel Shaker', category: 'ACCESSORIES', desc: 'Durable, odor-resistant stainless steel protein shaker bottle.', price: 19.99, stock: 45, status: 'IN STOCK', rating: 4.8, image: 'https://images.unsplash.com/photo-1585864115160-f7035eb52db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 5, title: 'Creatine Monohydrate 500g', category: 'CREATINE', desc: 'Pure micronized creatine monohydrate for strength.', price: 29.99, stock: 10, status: 'LOW STOCK', rating: 4.6, image: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 6, title: 'BCAA Recovery Powder', category: 'AMINO ACIDS', desc: 'Intra-workout BCAA blend to reduce muscle fatigue.', price: 24.99, stock: 0, status: 'OUT OF STOCK', rating: 4.7, image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 7, title: 'Mass Gainer 5kg - Chocolate', category: 'PROTEIN', desc: 'High-calorie mass building formula with complex carbs.', price: 79.99, stock: 22, status: 'IN STOCK', rating: 4.5, image: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 8, title: 'Gym Bag Duffel Medium', category: 'ACCESSORIES', desc: 'Spacious and breathable gym bag with shoe compartment.', price: 45.00, stock: 8, status: 'LOW STOCK', rating: 4.9, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 9, title: 'Weightlifting Belt L', category: 'EQUIPMENT', desc: 'Genuine leather heavy-duty lifting belt for back support.', price: 49.99, stock: 15, status: 'IN STOCK', rating: 4.8, image: 'https://images.unsplash.com/photo-1582215688531-18e38d77a0fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 10, title: 'Resistance Bands Set', category: 'EQUIPMENT', desc: 'Set of 5 resistance bands with varying tension levels.', price: 25.99, stock: 0, status: 'OUT OF STOCK', rating: 4.3, image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 11, title: 'Vegan Protein 1kg - Berry', category: 'PROTEIN', desc: 'Plant-based pea and rice protein blend.', price: 44.99, stock: 30, status: 'IN STOCK', rating: 4.4, image: 'https://images.unsplash.com/photo-1628770281358-0056157121b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 12, title: 'Fish Oil Omega 3', category: 'VITAMINS', desc: 'High EPA/DHA omega 3 essential fatty acids.', price: 18.99, stock: 65, status: 'IN STOCK', rating: 4.7, image: 'https://images.unsplash.com/photo-1585864115160-f7035eb52db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
];

export default function Shop() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [category, setCategory] = useState('All');
  const [stockStatus, setStockStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Adjust to fit 4 grid items per row well

  // Define statistic blocks based on data
  const statBlocks = [
    new StatisticBlockData({
      title: 'Total Products',
      value: '1,248',
      bgColor: 'bg-primary-600',
      textColor: 'text-white',
      iconName: 'ClipboardText',
      iconColor: 'text-white',
      hasBgIcon: true
    }),
    new StatisticBlockData({
      title: 'Low Stock Alerts',
      value: '24',
      badgeText: 'Action Required',
      badgeType: 'action',
      bgColor: 'bg-secondary-50',
      textColor: 'text-foreground',
      iconName: 'Warning',
      iconColor: 'text-secondary-200',
      hasBgIcon: false
    }),
    new StatisticBlockData({
      title: 'Out of Stock',
      value: '12',
      badgeText: 'Urgent',
      badgeType: 'urgent',
      bgColor: 'bg-secondary-50',
      textColor: 'text-foreground',
      iconName: 'Package',
      iconColor: 'text-secondary-200',
      hasBgIcon: false
    }),
    new StatisticBlockData({
      title: 'Shop Revenue (MTD)',
      value: '$14.2k',
      badgeText: '+12% vs LY',
      badgeType: 'positive',
      bgColor: 'bg-secondary-50',
      textColor: 'text-foreground',
      iconName: 'TrendUp',
      iconColor: 'text-secondary-200',
      hasBgIcon: false
    })
  ];

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    let prods = [...mockProducts];
    
    if (search) {
      prods = prods.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase()));
    }
    
    if (category !== 'All') {
      prods = prods.filter(p => p.category === category);
    }

    if (stockStatus !== 'All') {
      prods = prods.filter(p => p.status === stockStatus);
    }

    if (sortBy === 'Price: Low to High') {
      prods.sort((a,b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      prods.sort((a,b) => b.price - a.price);
    }

    return prods;
  }, [search, sortBy, category, stockStatus]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'IN STOCK': return 'bg-success-bg text-success';
      case 'LOW STOCK': return 'bg-[#fff4e5] text-[#ff9800]';
      case 'OUT OF STOCK': return 'bg-error-bg text-error';
      default: return 'bg-secondary-200 text-secondary-600';
    }
  };

  return (
    <div className='bg-secondary-100 min-h-dvh p-8'>
      
      {/* Search and Filters Bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4 flex-1">
          {/* Search */}
          <div className="relative w-72">
            <MagnifyingGlass size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"/>
            <input
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 pl-10 w-full px-4 py-2 border border-secondary-200 rounded-md bg-secondary-50 focus:outline-none focus:border-primary-600 transition-colors"
            />
          </div>

          {/* Sort By Select */}
          <div className="relative">
            <SlidersHorizontal size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 pointer-events-none"/>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              className="h-10 pl-10 pr-8 py-2 appearance-none border border-secondary-200 rounded-md bg-secondary-50 text-secondary-600 text-sm focus:outline-none focus:border-primary-600 cursor-pointer"
            >
              <option value="Newest">Sort by</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
            </select>
            <CaretDown size={14} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 pointer-events-none"/>
          </div>

          {/* Category Select */}
          <div className="relative">
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setCurrentPage(1); }}
              className="h-10 px-4 pr-8 py-2 appearance-none border border-secondary-200 rounded-md bg-secondary-50 text-secondary-600 text-sm focus:outline-none focus:border-primary-600 cursor-pointer"
            >
              <option value="All">Category</option>
              <option value="PROTEIN">Protein</option>
              <option value="PRE-WORKOUT">Pre-Workout</option>
              <option value="VITAMINS">Vitamins</option>
              <option value="EQUIPMENT">Equipment</option>
              <option value="ACCESSORIES">Accessories</option>
            </select>
            <CaretDown size={14} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 pointer-events-none"/>
          </div>

          {/* Stock Status Select */}
          <div className="relative">
            <select
              value={stockStatus}
              onChange={(e) => { setStockStatus(e.target.value); setCurrentPage(1); }}
              className="h-10 px-4 pr-8 py-2 appearance-none border border-secondary-200 rounded-md bg-secondary-50 text-secondary-600 text-sm focus:outline-none focus:border-primary-600 cursor-pointer"
            >
              <option value="All">Stock Status</option>
              <option value="IN STOCK">In Stock</option>
              <option value="LOW STOCK">Low Stock</option>
              <option value="OUT OF STOCK">Out of Stock</option>
            </select>
            <CaretDown size={14} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 pointer-events-none"/>
          </div>

          {/* Filter Button */}
          <Button className="h-10 flex items-center gap-2 px-4 py-2 rounded-md transition text-primary-600 hover:bg-secondary-200 bg-secondary-50 border border-secondary-200 cursor-pointer">
            <Funnel size={18} />
            Filter
          </Button>
        </div>

        {/* Add Product Button */}
        <Button className="h-10 flex items-center gap-2 px-5 py-2 rounded-xl font-medium bg-primary-600 text-white hover:bg-primary-900 transition-colors shadow-sm">
          <Plus size={20} weight="bold" />
          Add Product
        </Button>
      </div>

      {/* Statistic Blocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statBlocks.map((block, index) => (
          <StatisticBlockShop key={index} data={block} />
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedProducts.map(product => (
          <div key={product.id} className="bg-secondary-50 rounded-xl border border-border-light overflow-hidden flex flex-col group hover:shadow-lg transition-shadow duration-300">
            {/* Image Box */}
            <div className="w-full h-56 relative bg-secondary-200">
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
              <div className={`absolute top-3 right-3 px-2.5 py-1 rounded font-bold text-[10px] tracking-wide ${getStatusBadgeStyle(product.status)}`}>
                {product.status}
              </div>
            </div>
            
            {/* Content Box */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <span className="text-primary-600 font-semibold text-xs tracking-wide">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-sm font-medium text-secondary-700">
                  <Star size={14} weight="fill" className="text-yellow-400" />
                  {product.rating}
                </div>
              </div>
              
              <h4 className="text-lg font-bold text-foreground mb-1 leading-tight line-clamp-1">
                {product.title}
              </h4>
              <p className="text-secondary-500 text-sm mb-4 line-clamp-2">
                {product.desc}
              </p>
              
              <div className="mt-auto">
                <div className="flex justify-between items-end border-t border-border-light pt-4 mb-4">
                  <div className="text-2xl font-bold text-foreground">
                    ${product.price}
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-secondary-400 font-semibold mb-0.5">STOCK AVAILABLE</div>
                    <div className="text-sm font-bold text-foreground">{product.stock} units</div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="flex-1 flex justify-center items-center h-9 rounded-md bg-secondary-100 text-secondary-600 hover:bg-secondary-200 transition-colors">
                    <Eye size={18} />
                  </button>
                  <button className="flex-1 flex justify-center items-center h-9 rounded-md bg-secondary-100 text-secondary-600 hover:bg-secondary-200 transition-colors">
                    <PencilSimple size={18} />
                  </button>
                  <button className="flex-1 flex justify-center items-center h-9 rounded-md bg-[#fff4f4] text-error hover:bg-error hover:text-white transition-colors">
                    <Trash size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center border border-border-light rounded-md bg-secondary-50 text-secondary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary-100"
          >
            <CaretLeft size={16} />
          </button>

          {generatePageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2 text-secondary-400">...</span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 flex items-center justify-center rounded-md font-medium text-sm transition-colors ${
                  currentPage === page 
                    ? 'bg-primary-600 text-white' 
                    : 'border border-border-light bg-secondary-50 text-secondary-600 hover:bg-secondary-100'
                }`}
              >
                {page}
              </button>
            )
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 flex items-center justify-center border border-border-light rounded-md bg-secondary-50 text-secondary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary-100"
          >
            <CaretRight size={16} />
          </button>
        </div>
      )}

    </div>
  );
}
