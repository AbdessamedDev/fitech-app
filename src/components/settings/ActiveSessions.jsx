import { DeviceMobileCameraIcon, DeviceTabletCameraIcon, LaptopIcon, MonitorIcon, XIcon } from '../../icons/index';
import { useTranslation } from 'react-i18next';

// Simulated backend data
const fetchedSessions = [
  { id: 1, device: 'MacBook Pro — Chrome', location: 'San Francisco, CA', time: 'Current session', isCurrent: true, icon: MonitorIcon },
  { id: 2, device: 'iPhone 14 Pro — App', location: 'San Francisco, CA', time: '2 hours ago', isCurrent: false, icon: DeviceMobileCameraIcon },
  { id: 3, device: 'iPad Mini — App', location: 'San Francisco, CA', time: '1 day ago', isCurrent: false, icon: DeviceTabletCameraIcon },
  { id: 4, device: 'Windows Desktop — Edge', location: 'New York, NY', time: '3 days ago', isCurrent: false, icon: LaptopIcon }
];

export function ActiveSessions() {
  const { t } = useTranslation();

  return (
    <div className="bg-secondary-50 border border-secondary-200 rounded-2xl shadow-sm p-8">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[16px] font-extrabold text-secondary-900 tracking-tight">{t('Active Sessions')}</h3>
        <button className="text-[13px] font-extrabold text-error hover:opacity-80 transition-all whitespace-nowrap cursor-pointer active:scale-98">
          {t('Logout other devices')}
        </button>
      </div>

      <div className="rounded-xl overflow-hidden pl-1">
        <div className="space-y-0 divide-y divide-secondary-200 overflow-y-auto overflow-x-hidden max-h-[148px] pr-2 mini-scrollbar">
          {fetchedSessions.map((session) => {
            const Icon = session.icon;
            return (
              <div key={session.id} className="flex items-center gap-4 px-3 py-3 h-[74px] bg-secondary-50 hover:bg-secondary-100 transition-colors group">
                <div className="text-secondary-500 shrink-0">
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p className="font-bold text-secondary-800 text-[14px] leading-tight truncate">{session.device}</p>
                  <p className="text-secondary-400 text-[12px] font-medium leading-tight truncate mt-0.5">{session.location} • {session.isCurrent ? t('Active Now') : session.time}</p>
                </div>
                {session.isCurrent ? (
                  <span className="shrink-0 px-2 py-1 rounded-sm text-[10px] tracking-wide uppercase font-extrabold bg-success-bg text-success">
                    {t('Active Now')}
                  </span>
                ) : (
                  <button className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-secondary-400 hover:bg-secondary-200 hover:text-secondary-700 transition-colors ltr:ml-auto rtl:mr-auto">
                    <XIcon size={16} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
