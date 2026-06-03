import { useState, useMemo, useEffect, useCallback } from 'react';
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
import AddEquipmentModal from '../../components/ui/AddEquipmentModal';
import { api } from '../../services/api';

const EQUIPMENT_IMAGE_API = "http://localhost:5106";

const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Name (A-Z)', value: 'name-asc' },
  { label: 'Name (Z-A)', value: 'name-desc' },
  { label: 'Status', value: 'status' }
];

const categoryOptions = [
  { label: 'All Categories', value: 'All' },
  { label: 'Cardio', value: 'cardio' },
  { label: 'Strength', value: 'strength' },
  { label: 'Free Weights', value: 'free_weights' },
  { label: 'Cables', value: 'cables' },
  { label: 'Functional', value: 'functional' }
];

const statusOptions = [
  { label: 'All Statuses', value: 'All' },
  { label: 'Available', value: 'available' },
  { label: 'Broken', value: 'broken' },
  { label: 'Maintenance', value: 'maintenance' }
];

function getStatusDisplay(status) {
  switch (status) {
    case 'available': return 'Available';
    case 'broken': return 'Broken';
    case 'maintenance': return 'Maintenance';
    default: return status;
  }
}

function getCategoryDisplay(category) {
  const map = { cardio: 'Cardio', strength: 'Strength', free_weights: 'Free Weights', cables: 'Cables', functional: 'Functional' };
  return map[category] || category || 'Other';
}

const EquipmentCard = ({ equipment, onDelete }) => {
  const { t } = useTranslation();
  const isAvailable = equipment.status === 'available';

  return (
    <div className="bg-secondary-50 rounded-xl border border-secondary-300 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col hover:-translate-y-1 group h-full">
      <div className="relative h-48 w-full bg-secondary-100 overflow-hidden">
        <img
          src={equipment.imageUrl ? `${EQUIPMENT_IMAGE_API}${equipment.imageUrl}` : `https://placehold.co/600x400/F5F5F8/A3A3B3?font=montserrat&text=${encodeURIComponent(equipment.name)}`}
          alt={equipment.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute top-3 ltr:right-3 rtl:left-3 bg-secondary-50 backdrop-blur-sm px-2.5 py-1.5 rounded-lg text-secondary-900 text-xs font-extrabold tracking-widest shadow-sm flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <QrCode size={14} weight="bold" />
          <span>ID-{equipment.id.substring(0, 8)}</span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col bg-secondary-50">
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h3 className="text-secondary-800 font-bold text-[18px] leading-tight line-clamp-2">
            {equipment.name}
          </h3>
          <div className="shrink-0 pt-0.5">
            <span className={`px-2 py-1 text-[10px] font-semibold rounded-full uppercase tracking-wide inline-block ${isAvailable ? 'bg-success-bg text-success' : 'bg-error-bg text-error'}`}>
              {t(getStatusDisplay(equipment.status))}
            </span>
          </div>
        </div>

        <p className="text-secondary-500 text-[13px] font-medium mb-3">
          {t(getCategoryDisplay(equipment.category))}
        </p>

        <p className="text-secondary-400 text-[13px] mb-3 line-clamp-2">
          {equipment.description || t('No description')}
        </p>

        <div className="flex items-center gap-1.5 mt-auto mb-5 text-secondary-400 text-[13px]">
          <MapPin size={16} weight="regular" />
          <span>{t('Gym Floor')}</span>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-secondary-300">
          <button className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-bg-suspended text-suspended hover:bg-secondary-200 hover:text-secondary-800 transition-colors cursor-pointer group/btn">
            <Eye size={18} weight="bold" className="group-hover/btn:scale-110 transition-transform" />
          </button>
          <button className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-bg-suspended text-suspended hover:bg-secondary-200 hover:text-secondary-800 transition-colors cursor-pointer group/btn">
            <PencilSimple size={18} weight="bold" className="group-hover/btn:scale-110 transition-transform" />
          </button>
          <div className="flex-1"></div>
          <button
            onClick={() => onDelete(equipment.id, equipment.name)}
            className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-error-bg text-error hover:bg-error hover:text-error-bg transition-colors cursor-pointer group/btn"
          >
            <Trash size={18} weight="bold" className="group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function EquipmentPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const itemsPerPage = 8;

  const fetchEquipment = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.listEquipment();
      setEquipment(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load equipment');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.deleteEquipment(id);
      setEquipment(prev => prev.filter(eq => eq.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete equipment');
    }
  };

  const filteredEquipments = useMemo(() => {
    let result = equipment;

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
  }, [search, categoryFilter, statusFilter, sortBy, equipment]);

  const totalPages = Math.ceil(filteredEquipments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEquipments = filteredEquipments.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, statusFilter, sortBy]);

  return (
    <div className='bg-secondary-100 min-h-screen p-4 sm:p-6 lg:p-8 w-full font-sans transition-all duration-300'>
      <div className="max-w-380 mx-auto w-full">
        {showAddEquipmentModal && (
          <AddEquipmentModal onClose={() => setShowAddEquipmentModal(false)} onEquipmentAdded={fetchEquipment} />
        )}

        <div className="flex flex-wrap items-center w-full gap-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search equipment by name or ID..."
            className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] shrink-0"
          />

          <div className="flex flex-1 flex-wrap items-center justify-between gap-4 min-w-[280px]">
            <div className="flex items-center flex-wrap gap-3">
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
              <button
                onClick={() => document.getElementById('global-search-input')?.focus()}
                className="h-10 flex items-center gap-2 px-4 py-2 rounded-md transition-colors bg-transparent text-primary-600 hover:bg-primary-50 active:bg-primary-100 cursor-pointer text-sm font-bold whitespace-nowrap"
              >
                <Funnel size={18} />
                {t('Filter')}
              </button>
            </div>

            <PrimaryButton icon={Plus} onClick={() => setShowAddEquipmentModal(true)}>
              {t('Add Equipment')}
            </PrimaryButton>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        )}

        {error && !loading && (
          <div className="w-full py-16 flex flex-col items-center justify-center bg-secondary-50 rounded-xl border border-secondary-300 shadow-sm">
            <p className="text-error text-lg font-medium mb-4">{error}</p>
            <button onClick={fetchEquipment} className="px-4 py-2 text-primary-600 font-semibold hover:bg-primary-50 rounded-md transition-colors cursor-pointer">
              {t('Try again')}
            </button>
          </div>
        )}

        {!loading && !error && paginatedEquipments.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in zoom-in-95 duration-500">
            {paginatedEquipments.map((item, index) => (
              <div key={item.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both h-full">
                <EquipmentCard equipment={item} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredEquipments.length === 0 && (
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

        {!loading && !error && totalPages > 1 && (
          <div className="mt-10 pb-8 animate-in fade-in duration-500 delay-300">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
