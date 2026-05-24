import { useState, useRef, useEffect } from 'react';
import { MoreVertical } from '../../icons/index';

/**
 * Reusable dropdown component for table row operations.
 *
 * @param {Array} items - Array of dropdown items. Each item must have:
 *   - label: string (text to display)
 *   - icon: React node (optional icon)
 *   - onClick: function (callback when clicked)
 *   - className: string (optional additional classes)
 * @param {string} align - Dropdown alignment relative to the trigger button ('left' | 'right')
 */
export function TableOperationsDropdown({ items = [], align = 'right' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = (event) => {
    event.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-secondary-700 transition-all hover:bg-secondary-200 active:bg-secondary-300 focus:outline-none cursor-pointer"
        aria-label="Open operations menu"
      >
        <MoreVertical size={20} weight="bold" />
      </button>

      {isOpen && (
        <div
          className={`absolute z-[999] mt-1.5 w-[176px] bg-secondary-50 border border-secondary-200 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-200 ${
            align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col px-1.5 gap-0.5">
            {items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                    if (item.onClick) item.onClick();
                  }}
                  className={`w-full px-3 py-2 text-[13px] font-semibold rounded-lg cursor-pointer transition-colors flex items-center gap-2.5 text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900 leading-none ${
                    item.className || ''
                  }`}
                >
                  {Icon && <span className="text-secondary-400 shrink-0 flex items-center justify-center">{Icon}</span>}
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
