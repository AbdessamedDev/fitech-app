import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const items = [
  { id: 'new_messages', labelKey: 'New Messages', defaultChecked: true },
  { id: 'session_reminders', labelKey: 'Session Reminders', defaultChecked: true },
  { id: 'client_updates', labelKey: 'Client Updates', defaultChecked: false },
  { id: 'push_notifs', labelKey: 'Push Notifications', defaultChecked: true },
];

export function NotificationCenter() {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(() =>
    Object.fromEntries(items.map(i => [i.id, i.defaultChecked]))
  );

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm relative" style={{background: 'linear-gradient(135deg, #7c3aed 0%, #6942ff 100%)'}}>
      
      {/* Bottom Light Glowing Shadow */}
      <div className="absolute -bottom-16 ltr:-right-16 rtl:-left-16 w-56 h-56 bg-[#a78bfa] rounded-full blur-[50px] pointer-events-none z-0 opacity-80"></div>

      <div className="p-6 relative z-10">
        <h3 className="text-white font-bold text-[18px] tracking-tight mb-5">{t('Notification Center')}</h3>
        <div className="space-y-0">
          {items.map((item, index) => (
            <div key={item.id}>
              {item.id === 'push_notifs' && <hr className="border-white/20 my-3" />}
              <div className={`flex items-center justify-between ${index === 0 && item.id !== 'push_notifs' ? 'pb-4' : item.id === 'push_notifs' ? 'py-1' : 'py-4'}`}>
                <span className="text-white text-[14px] font-medium">{t(item.labelKey)}</span>
                <button
                  onClick={() => toggle(item.id)}
                  aria-checked={checked[item.id]}
                  role="checkbox"
                  className={`w-[18px] h-[18px] rounded-[4px] flex items-center justify-center shrink-0 transition-all cursor-pointer border border-transparent hover:opacity-80`}
                  style={{
                    backgroundColor: checked[item.id] ? 'rgba(255, 255, 255, 0.4)' : 'rgba(167, 139, 250, 0.4)', 
                    backdropFilter: checked[item.id] ? 'none' : 'blur(4px)',
                  }}
                >
                  {checked[item.id] && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6.5l2 2 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
