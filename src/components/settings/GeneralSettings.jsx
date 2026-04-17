import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function CustomSelect({ value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-[42px] px-4 rounded-lg border bg-secondary-50 transition-all shadow-sm text-[14px] font-medium flex justify-between items-center ${isOpen ? 'border-primary-600 ring-4 ring-primary-50 text-secondary-900' : 'border-secondary-300 text-secondary-700 hover:border-secondary-400'}`}
      >
        <span className="truncate">{value}</span>
        <svg className={`text-secondary-400 transition-transform duration-300 shrink-0 ltr:ml-2 rtl:mr-2 ${isOpen ? 'rotate-180 text-primary-600' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-secondary-50 border border-secondary-200 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 py-1.5 top-full">
          <div className="max-h-56 overflow-y-auto mini-scrollbar flex flex-col px-1.5 gap-0.5">
            {options.map((opt, idx) => (
              <div
                key={idx}
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className={`px-3 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer transition-colors flex items-center gap-2 ${value === opt ? 'bg-primary-50 text-primary-600' : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'}`}
              >
                {opt}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const tzOptions = [
  'GMT -08:00 Pacific Time',
  'GMT -05:00 Eastern Time',
  'GMT +00:00 UTC',
  'GMT +01:00 Central European Time',
  'GMT +03:00 Arabia Standard Time'
];

const timeOptions = [
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', 
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', 
  '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM'
];

export function GeneralSettings() {
  const { t } = useTranslation();
  const [timeZone, setTimeZone] = useState('GMT -08:00 Pacific Time');
  const [startTime, setStartTime] = useState('08:00 AM');
  const [endTime, setEndTime] = useState('06:00 PM');

  return (
    <div className="bg-secondary-50 border border-secondary-200 rounded-xl shadow-sm overflow-visible">
      {/* Header */}
      <div className="px-8 pt-6 pb-5">
        <h2 className="text-[20px] font-extrabold text-secondary-900 tracking-tight">{t('General Settings')}</h2>
        <p className="text-[14px] text-secondary-500 font-medium mt-0.5">{t('Manage globals')}</p>
      </div>

      {/* Timezone & Session Duration */}
      <div className="px-8 py-5 border-b border-secondary-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Time Zone */}
          <div className="space-y-1.5 relative z-30">
            <label className="text-[13px] font-extrabold text-secondary-700">{t('Time zone')}</label>
            <CustomSelect value={timeZone} onChange={setTimeZone} options={tzOptions} />
          </div>

          {/* Default Session Duration */}
          <div className="space-y-1.5 relative z-10">
            <label className="text-[13px] font-extrabold text-secondary-700">{t('Default Session Duration')}</label>
            <div className="relative flex items-center">
              <input
                type="number"
                defaultValue={60}
                className="flex-1 h-[42px] ltr:pl-4 rtl:pr-4 ltr:pr-16 rtl:pl-16 rounded-lg border border-secondary-300 bg-secondary-50 focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-50 transition-all shadow-sm text-[14px] font-medium text-secondary-700 hover:border-secondary-400"
              />
              <span className="absolute ltr:right-4 rtl:left-4 text-[14px] text-secondary-400 font-bold select-none">{t('mins')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Working Hours */}
      <div className="px-8 py-6 relative z-20">
        <p className="text-[11px] font-extrabold tracking-widest uppercase text-secondary-400 mb-4">{t('WORKING HOURS')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[13px] font-extrabold text-secondary-700">{t('Start Time')}</label>
            <CustomSelect value={startTime} onChange={setStartTime} options={timeOptions} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-extrabold text-secondary-700">{t('End Time')}</label>
            <CustomSelect value={endTime} onChange={setEndTime} options={timeOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
