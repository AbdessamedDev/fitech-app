import { useState, useRef, useEffect } from 'react';
import { CaretDown } from '../../icons/index';
import { useTranslation } from 'react-i18next';

export function FilterDropdown({ label, icon: Icon, options, value, onChange, className = '' }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = value !== 'All' && !label.includes('Sort') ? t(value) : t(label);

  return (
    <div className={`relative min-w-[140px] ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-10 w-full flex items-center justify-between gap-2 px-4 py-2 rounded-md transition-all bg-secondary-50 text-secondary-500 border cursor-pointer shadow-sm text-sm whitespace-nowrap ${isOpen ? 'border-primary-600 ring-2 ring-primary-50' : 'border-secondary-300 hover:bg-secondary-100'}`}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={18} />}
          <span className={value !== 'All' && !label.includes('Sort') ? 'text-primary-800 font-bold' : ''}>
            {selectedLabel}
          </span>
        </div>
        <CaretDown size={14} className={`text-secondary-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-full bg-secondary-50 border border-secondary-300 rounded-md shadow-lg z-50 py-1 overflow-hidden min-w-max transform opacity-100 scale-100 origin-top transition-all animate-in fade-in zoom-in-95 duration-100">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              className={`w-full text-left rtl:text-right px-4 py-2 text-sm transition-colors ${value === opt.value ? 'bg-primary-50 text-primary-600 font-bold' : 'text-secondary-600 hover:bg-secondary-100'}`}
            >
              {t(opt.label)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
