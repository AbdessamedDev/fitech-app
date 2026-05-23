import { useState, useEffect, useRef } from 'react';
import { SunDim, Moon, CaretDown } from '../../icons/index';
import { useTranslation } from 'react-i18next';
import { getLanguageCode, loadScopedSettings, saveScopedSettings } from './settingsPreferences';

export function SystemPreferences({ scope = 'admin' }) {
  const { t, i18n } = useTranslation();
  const scopedSettings = loadScopedSettings(scope);
  const [unit, setUnit] = useState(scopedSettings.unit);
  const [theme, setTheme] = useState(scopedSettings.theme);
  const [language, setLanguage] = useState(scopedSettings.language);

  const [isLangOpen, setIsLangOpen] = useState(false);
  const langDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languageOptions = [
    { value: 'English (United States)', labelKey: 'English (United States)' },
    { value: 'French (France)', labelKey: 'French (France)' },
    { value: 'Spanish (Spain)', labelKey: 'Spanish (Spain)' },
    { value: 'Arabic', labelKey: 'Arabic' },
  ];

  // Handle Theme
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    saveScopedSettings(scope, { theme: newTheme });
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleUnitChange = (nextUnit) => {
    setUnit(nextUnit);
    saveScopedSettings(scope, { unit: nextUnit });
  };

  const handleLanguageChange = (nextLanguage) => {
    const languageCode = getLanguageCode(nextLanguage);
    setLanguage(nextLanguage);
    saveScopedSettings(scope, { language: nextLanguage, languageCode });
    i18n.changeLanguage(languageCode);
    document.documentElement.dir = languageCode === 'ar' ? 'rtl' : 'ltr';
    setIsLangOpen(false);
  };

  return (
    <div className="bg-secondary-200/40 border border-secondary-300 rounded-xl shadow-sm p-6">
      <h3 className="text-secondary-800 font-bold text-[18px] tracking-tight mb-4">{t('System Preferences')}</h3>

      {/* Measurement Units */}
      <div className="mb-6">
        <p className="text-[12px] font-bold tracking-widest uppercase text-secondary-400 mb-2">{t('MEASUREMENT UNITS')}</p>
        <div className="flex items-center rounded-lg overflow-hidden p-1 bg-secondary-100">
          <button
            onClick={() => handleUnitChange('metric')}
            className={`flex-1 h-[38px] text-[13px] font-bold rounded-md transition-all duration-200 cursor-pointer ${
              unit === 'metric'
                ? 'bg-secondary-50 text-secondary-800 shadow-sm border border-secondary-200'
                : 'bg-transparent text-secondary-600 hover:text-secondary-700'
            }`}
          >
            {t('Metric')}
          </button>
          <button
            onClick={() => handleUnitChange('imperial')}
            className={`flex-1 h-[38px] text-[13px] font-bold rounded-md transition-all duration-200 cursor-pointer ${
              unit === 'imperial'
                ? 'bg-secondary-50 text-secondary-800 shadow-sm border border-secondary-200'
                : 'bg-transparent text-secondary-600 hover:text-secondary-700'
            }`}
          >
            {t('Imperial')}
          </button>
        </div>
      </div>

      {/* Interface Theme */}
      <div className="mb-6">
        <p className="text-[12px] font-bold tracking-widest uppercase text-secondary-400 mb-2">{t('INTERFACE THEME')}</p>
        <div className="flex items-center rounded-lg overflow-hidden p-1 gap-1">
          <button
            onClick={() => handleThemeChange('light')}
            className={`flex-1 h-[42px] flex items-center justify-center gap-1.5 text-[14px] font-bold rounded-md transition-all duration-200 border-2 cursor-pointer ${
              theme === 'light'
                ? 'bg-secondary-50 text-secondary-800 border-primary-600 shadow-sm'
                : 'bg-secondary-50 text-secondary-800 border-transparent hover:border-secondary-300'
            }`}
          >
            <SunDim size={18} weight={theme === 'light' ? 'regular' : 'regular'} />
            <span className="rtl:mt-1">{t('Light')}</span>
          </button>
          <button
            onClick={() => handleThemeChange('dark')}
            className={`flex-1 h-[42px] flex items-center justify-center gap-1.5 text-[14px] font-bold rounded-md transition-all duration-200 border-2 cursor-pointer ${
              theme === 'dark'
                ? 'bg-[#3b3d4a] text-white border-primary-600 shadow-sm'
                : 'bg-[#3b3d4a] text-white border-transparent hover:opacity-90'
            }`}
          >
            <Moon size={18} weight={theme === 'dark' ? 'regular' : 'regular'} />
            <span className="rtl:mt-1">{t('Dark')}</span>
          </button>
        </div>
      </div>

      {/* Default Language */}
      <div>
        <p className="text-[11px] font-extrabold tracking-widest uppercase text-secondary-400 mb-2.5">{t('DEFAULT LANGUAGE')}</p>
        <div className="relative" ref={langDropdownRef}>
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className={`w-full h-[42px] px-4 flex items-center justify-between rounded-lg border bg-secondary-50/50 transition-all shadow-sm text-[13px] cursor-pointer ${isLangOpen ? 'border-primary-600 ring-2 ring-primary-50 text-secondary-800 font-bold' : 'border-secondary-200 hover:border-secondary-300 text-secondary-800 font-bold'}`}
          >
            <span className="rtl:mt-1">{t(languageOptions.find(opt => opt.value === language)?.labelKey || language)}</span>
            <CaretDown size={14} className={`text-secondary-400 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>

          {isLangOpen && (
            <div className="absolute top-full right-0 mt-1.5 w-full bg-secondary-50 border border-secondary-200 rounded-lg shadow-lg z-50 py-1.5 overflow-hidden transform opacity-100 scale-100 origin-top transition-all animate-in fade-in zoom-in-95 duration-100">
              {languageOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleLanguageChange(opt.value)}
                  className={`w-full text-left rtl:text-right px-4 flex items-center justify-between py-2 text-[13px] transition-colors ${language === opt.value ? 'bg-primary-50/50 text-primary-600 font-extrabold' : 'text-secondary-600 font-medium hover:bg-secondary-100 hover:text-secondary-800'}`}
                >
                  <span className="rtl:mt-1">{t(opt.labelKey)}</span>
                  {language === opt.value && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-600"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
