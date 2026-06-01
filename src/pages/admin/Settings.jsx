import { useTranslation } from 'react-i18next';
import { GeneralSettings } from '../../components/settings/GeneralSettings';
import { SystemPreferences } from '../../components/settings/SystemPreferences';
import { ProTip } from '../../components/settings/ProTip';

export default function Settings({ scope = 'admin' }) {
  const { t } = useTranslation();

  return (
    <div className="bg-secondary-100 min-h-screen p-4 sm:p-6 lg:p-8 w-full font-sans transition-all duration-300">
      <div className="max-w-380 mx-auto w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Settings Header */}
        <div className="mb-2">
          <h1 className="text-2xl font-black text-secondary-900 tracking-tight">
            {t('Settings')}
          </h1>
          <p className="text-[14px] text-secondary-500 font-medium mt-1">
            {t('Configure your workspace behavior, theme, timezone and working hours defaults.')}
          </p>
        </div>

        {/* Masterpiece Side-by-Side Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN: Timezone, Session Duration, Working Hours */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            <GeneralSettings scope={scope} />
          </div>

          {/* RIGHT COLUMN: Interface Preferences, Language, Tips */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
            <SystemPreferences scope={scope} />
            <ProTip />
          </div>

        </div>
      </div>
    </div>
  );
}
