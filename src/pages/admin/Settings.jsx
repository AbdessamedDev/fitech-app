import { GeneralSettings } from '../../components/settings/GeneralSettings';
import { TwoFactorSettings } from '../../components/settings/TwoFactorSettings';
import { ActiveSessions } from '../../components/settings/ActiveSessions';
import { NotificationCenter } from '../../components/settings/NotificationCenter';
import { SystemPreferences } from '../../components/settings/SystemPreferences';
import { ProTip } from '../../components/settings/ProTip';

export default function Settings() {
  return (
    <div className="bg-secondary-100 min-h-screen p-4 sm:p-6 lg:p-8 w-full font-sans transition-all duration-300">
      <div className="max-w-350 mx-auto w-full">
        <div className="flex flex-col xl:flex-row gap-6 items-stretch animate-in fade-in zoom-in-95 duration-500">

          {/* LEFT COLUMN */}
          <div className="flex-1 min-w-0 flex flex-col justify-start gap-4 xl:gap-12.5">
            <GeneralSettings />
            <TwoFactorSettings />
            <ActiveSessions />
          </div>

          {/* RIGHT COLUMN */}
          <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-4">
            <NotificationCenter />
            <SystemPreferences />
            <ProTip />
          </div>

        </div>
      </div>
    </div>
  );
}
