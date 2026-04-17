import { MagnifyingGlassIcon } from '../../icons/index';
import { useTranslation } from 'react-i18next';

export function SearchInput({ value, onChange, placeholder = "Search...", className = "" }) {
  const { t } = useTranslation();
  return (
    <div className={`relative ${className}`}>
      <MagnifyingGlassIcon size={18} className="absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 text-secondary-400" />
      <input
        placeholder={t(placeholder)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 rounded-md border border-secondary-300 bg-secondary-50 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-50 transition-all shadow-sm text-sm"
      />
    </div>
  )
}
