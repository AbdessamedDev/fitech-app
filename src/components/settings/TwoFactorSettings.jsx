import { useState } from 'react';
import { LockKey } from '../../icons/index';
import { useTranslation } from 'react-i18next';

export function TwoFactorSettings() {
  const { t } = useTranslation();
  const [twoFa, setTwoFa] = useState(true);

  return (
    <div className="bg-secondary-50 border border-secondary-200 rounded-2xl shadow-sm p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-[16px] font-extrabold text-secondary-900 tracking-tight">{t('Two-factor authentication')}</h3>
          <p className="text-[13px] text-secondary-500 font-medium mt-0.5">{t('Two factor description')}</p>
        </div>
        {/* Toggle */}
        <button
          onClick={() => setTwoFa(!twoFa)}
          className={`relative w-11 h-[24px] rounded-full transition-colors duration-300 shrink-0 cursor-pointer ${twoFa ? 'bg-primary-600' : 'bg-secondary-300'}`}
        >
          <span className={`absolute top-[2px] ltr:left-[2px] rtl:right-[2px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-300 ${twoFa ? 'ltr:translate-x-[20px] rtl:-translate-x-[20px]' : 'translate-x-0'}`} />
        </button>
      </div>

      <button className="mt-5 flex items-center gap-2 text-primary-600 hover:text-primary-800 font-extrabold text-sm transition-all group cursor-pointer active:scale-98">
        <LockKey size={18} weight="duotone" className="group-hover:scale-110 transition-transform" />
        {t('Change password')}
      </button>
    </div>
  );
}
