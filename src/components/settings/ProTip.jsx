import { useTranslation } from 'react-i18next';

export function ProTip() {
  const { t } = useTranslation();

  return (
    <div className="border-2 border-dashed border-secondary-200 bg-secondary-50 rounded-xl p-6 flex flex-col items-start shadow-sm">
      {/* Lightbulb Icon */}
      <div className="mb-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.5 13.5c0 .83.17 1.62.5 2.33V17a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1.17c.33-.71.5-1.5.5-2.33C14.5 11.01 13.49 10 12 10s-2.5 1.01-2.5 3.5Z" fill="#a78bfa" opacity="0.4"/>
          <path d="M12 2a7 7 0 0 0-4 12.8V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.2A7 7 0 0 0 12 2Z" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9.5 21h5M12 17v4" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"/>
          {/* Sparkles around bulb */}
          <path d="M19 5 L21 5 M19 5 L19 3 M19 5 L17 5 M19 5 L19 7" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <div>
        <h4 className="font-bold text-secondary-900 text-[14px] mb-1.5">{t('Pro Tip')}</h4>
        <p className="text-secondary-400 text-[12px] font-bold leading-relaxed">
          {t('Pro Tip Text')}
        </p>
      </div>
    </div>
  );
}
