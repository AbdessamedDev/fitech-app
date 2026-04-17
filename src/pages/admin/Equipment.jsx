import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SlidersHorizontal,
  Funnel,
  MapPin,
  Eye,
  PencilSimple,
  Trash,
  Plus,
  QrCode,
  Tag,
  PulseIcon,
  MagnifyingGlassIcon
} from '../../icons/index';

import { FilterDropdown } from '../../components/shared/FilterDropdown';
import { Pagination } from '../../components/shared/Pagination';
import { SearchInput } from '../../components/shared/SearchInput';
import { PrimaryButton } from '../../components/shared/PrimaryButton';

// --- MOCK DATA ---
const equipmentTypes = [
  { name: 'Treadmill Pro X1', category: 'Cardio', series: 'Series 5', image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&q=80&w=800' },
  { name: 'Smith Machine Elite', category: 'Strength', series: 'Series 3', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800' },
  { name: 'Peloton Bike+', category: 'Cardio', series: 'Studio', image: 'https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?auto=format&fit=crop&q=80&w=800' },
  { name: 'Cable Crossover Station', category: 'Strength', series: 'Ultimate', image: 'https://images.unsplash.com/photo-1581404456573-04e3895e7c84?auto=format&fit=crop&q=80&w=800' },
  { name: 'Concept2 Rower', category: 'Cardio', series: 'Pro', image: 'https://images.unsplash.com/photo-1596357395217-80de13130e92?auto=format&fit=crop&q=80&w=800' },
  { name: 'Leg Press Pro', category: 'Strength', series: 'Heavy', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800' },
  { name: 'StairMaster 10G', category: 'Cardio', series: 'Endurance', image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&q=80&w=800' },
  { name: 'Functional Trainer', category: 'Strength', series: 'Flex', image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800' },
];

const mockEquipments = Array.from({ length: 260 }).map((_, i) => {
  const type = equipmentTypes[i % equipmentTypes.length];
  const idNum = 9900 + i;
  return {
    id: idNum.toString(),
    name: type.name,
    category: type.category,
    series: type.series,
    location: `Room A${(i % 5) + 1} • Level ${(i % 3) + 1}`,
    status: (i % 7 === 3) ? 'Maintenance' : 'Available',
    image: type.image
  }
});

// --- FILTER CONFIG ---
const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Name (A-Z)', value: 'name-asc' },
  { label: 'Name (Z-A)', value: 'name-desc' },
  { label: 'Status', value: 'status' }
];

const categoryOptions = [
  { label: 'All Categories', value: 'All' },
  { label: 'Cardio', value: 'Cardio' },
  { label: 'Strength', value: 'Strength' }
];

const statusOptions = [
  { label: 'All Statuses', value: 'All' },
  { label: 'Available', value: 'Available' },
  { label: 'Maintenance', value: 'Maintenance' }
];

const EquipmentCard = ({ equipment }) => {
  const { t } = useTranslation();
  const isAvailable = equipment.status === 'Available';

  return (
    <div className="bg-secondary-50 rounded-xl border border-secondary-300 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col hover:-translate-y-1 group h-full">
      <div className="relative h-48 w-full bg-secondary-100 overflow-hidden">
        <img
          src={equipment.image}
          alt={equipment.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute top-3 ltr:right-3 rtl:left-3 bg-secondary-50 backdrop-blur-sm px-2.5 py-1.5 rounded-lg text-secondary-900 text-xs font-extrabold tracking-widest shadow-sm flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <QrCode size={14} weight="bold" />
          <span>ID-{equipment.id}</span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col bg-secondary-50">
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h3 className="text-secondary-800 font-bold text-[18px] leading-tight line-clamp-2">
            {equipment.name}
          </h3>
          <div className="shrink-0 pt-0.5">
            <span className={`px-2 py-1 text-[10px] font-semibold rounded-full uppercase tracking-wide inline-block ${isAvailable ? 'bg-success-bg text-success' : 'bg-error-bg text-error'}`}>
              {t(equipment.status)}
            </span>
          </div>
        </div>

        <p className="text-secondary-500 text-[13px] font-medium mb-3">
          {t(equipment.category)} • {t(equipment.series)}
        </p>

        <div className="flex items-center gap-1.5 mt-auto mb-5 text-secondary-400 text-[13px]">
          <MapPin size={16} weight="regular" />
          <span>{t(equipment.location, { defaultValue: equipment.location })}</span>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-secondary-300">
          <button className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-bg-suspended text-suspended hover:bg-secondary-200 hover:text-secondary-800 transition-colors cursor-pointer group/btn">
            <Eye size={18} weight="bold" className="group-hover/btn:scale-110 transition-transform" />
          </button>
          <button className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-bg-suspended text-suspended hover:bg-secondary-200 hover:text-secondary-800 transition-colors cursor-pointer group/btn">
            <PencilSimple size={18} weight="bold" className="group-hover/btn:scale-110 transition-transform" />
          </button>
          <div className="flex-1"></div>
          <button className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-error-bg text-error hover:bg-error hover:text-error-bg transition-colors cursor-pointer group/btn">
            <Trash size={18} weight="bold" className="group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}

// --- MAIN PAGE ---
export default function EquipmentPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // 8 items perfectly fit 2 rows in a 4-col layout

  const filteredEquipments = useMemo(() => {
    let result = mockEquipments;

    if (search) {
      result = result.filter(eq =>
        eq.name.toLowerCase().includes(search.toLowerCase()) ||
        eq.id.includes(search)
      );
    }

    if (categoryFilter !== 'All') {
      result = result.filter(eq => eq.category === categoryFilter);
    }

    if (statusFilter !== 'All') {
      result = result.filter(eq => eq.status === statusFilter);
    }

    result = [...result].sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      return 0;
    });

    return result;
  }, [search, categoryFilter, statusFilter, sortBy]);

  const totalPages = Math.ceil(filteredEquipments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEquipments = filteredEquipments.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, statusFilter, sortBy]);

  return (
    <div className='bg-secondary-100 min-h-screen p-4 sm:p-6 lg:p-8 w-full font-sans transition-all duration-300'>
      <div className="max-w-375 mx-auto w-full">

        {/* Controls Section */}
        <div className="flex flex-wrap items-center w-full gap-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          {/* Search */}
          <SearchInput 
            value={search} 
            onChange={setSearch} 
            placeholder="Search equipment by name or ID..."
            className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] shrink-0" 
          />

          {/* Other Controls */}
          <div className="flex flex-1 flex-wrap items-center justify-between gap-4 min-w-[280px]">
            <div className="flex items-center flex-wrap gap-3">
              {/* Dropdown Filters */}
              <FilterDropdown
                label="Sort by"
                icon={SlidersHorizontal}
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
              />

              <div className="hidden sm:block">
                <FilterDropdown
                  label="Category"
                  icon={Tag}
                  options={categoryOptions}
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                />
              </div>

              <div className="hidden md:block">
                <FilterDropdown
                  label="Status"
                  icon={PulseIcon}
                  options={statusOptions}
                  value={statusFilter}
                  onChange={setStatusFilter}
                />
              </div>

              {/* General Filter Button */}
              <button className="h-10 flex items-center gap-2 px-4 py-2 rounded-md transition-colors bg-transparent text-primary-600 hover:bg-primary-50 active:bg-primary-100 cursor-pointer text-sm font-bold whitespace-nowrap">
                <Funnel size={18} />
                {t('Filter')}
              </button>
            </div>

            <PrimaryButton icon={Plus}>
              {t('Add Equipment')}
            </PrimaryButton>
          </div>
        </div>

        {/* Grid Layout */}
        {paginatedEquipments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in zoom-in-95 duration-500 stagger-1">
            {paginatedEquipments.map((equipment, index) => (
              <div key={equipment.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both h-full">
                <EquipmentCard equipment={equipment} />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full py-16 flex flex-col items-center justify-center bg-secondary-50 rounded-xl border border-secondary-300 shadow-sm">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-400 mb-4">
              <MagnifyingGlassIcon size={32} />
            </div>
            <h3 className="text-secondary-800 font-bold text-lg mb-1">{t('No equipment found')}</h3>
            <p className="text-secondary-500 text-sm">{t("We couldn't find anything matching your filters.")}</p>
            <button
              onClick={() => { setSearch(''); setSortBy('newest'); setCategoryFilter('All'); setStatusFilter('All'); }}
              className="mt-4 px-4 py-2 text-primary-600 font-semibold hover:bg-primary-50 rounded-md transition-colors cursor-pointer"
            >
              {t('Clear Filters')}
            </button>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-10 pb-8 animate-in fade-in duration-500 delay-300">
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </div>

      </div>
    </div>
  )
}
