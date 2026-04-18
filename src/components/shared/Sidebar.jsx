import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from "../../assets/Logo.png";
import { useTranslation } from 'react-i18next';
import {
  SquaresFourIcon,                
  Users,                
  IdentificationCard,           
  Money,       
  BarbellIcon,              
  FileText,             
  ShoppingCart,         
  Gear,
  List,
  CaretRight,
  SignOut,
  ChatCircleText,
  Calendar,
} from '../../icons/index'

export function Sidebar({ role = 'admin' }) {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  const { t } = useTranslation()

  const adminNavItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: SquaresFourIcon },
    { label: 'Members', path: '/admin/members', icon: Users },
    { label: 'Subscriptions', path: '/admin/subscriptions', icon: IdentificationCard },
    { label: 'Finance', path: '/admin/finance', icon: Money },
    { label: 'Equipment', path: '/admin/equipment', icon: BarbellIcon },
    { label: 'Reports', path: '/admin/reports', icon: FileText },
    { label: 'Shop', path: '/admin/shop', icon: ShoppingCart },
  ]

  const coachNavItems = [
    { label: 'Dashboard', path: '/coach/dashboard', icon: SquaresFourIcon },
    { label: 'Clients', path: '/coach/clients', icon: Users },
    { label: 'Programs', path: '/coach/programs', icon: FileText },
    { label: 'Exercises', path: '/coach/exercises', icon: BarbellIcon },
    { label: 'Schedule', path: '/coach/schedule', icon: Calendar },
    { label: 'Messaging', path: '/coach/messaging', icon: ChatCircleText },
  ]

  const navItems = role === 'coach' ? coachNavItems : adminNavItems;
  const settingsPath = role === 'coach' ? '/coach/settings' : '/admin/settings';

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path)
  }

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-56'
      } bg-secondary-50 border border-secondary-300 transition-all duration-300 flex flex-col h-screen overflow-y-auto`}
    >
      {/* Header with Logo and Toggle */}
      <div className="flex items-center justify-between px-4 py-6 transition-colors">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-9 rounded-md flex items-center justify-center text-lg shrink-0">
              <img src={Logo} alt="Fitech Identity Logo" className="w-10 h-9 object-cover" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-bold text-xl text-secondary-900 leading-none">FitTech</span>
              {role === 'coach' && (
                <span className="text-[11px] font-bold text-secondary-500 mt-1 uppercase tracking-wider">Coach</span>
              )}
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-md transition-colors shrink-0 cursor-pointer"
          title={collapsed ? t('Expand') : t('Collapse')}
        >
          {collapsed ? <CaretRight size={20} className="rtl:rotate-180" /> : <List size={20} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-300 text-base font-normal ${
                active
                  ? 'text-primary-600 bg-primary-50 font-semibold'
                  : 'transition-colors hover:bg-opacity-0 text-secondary-600'
              }`}
              title={collapsed ? t(item.label) : ''}
            >
              <Icon size={25} className="shrink-0" />
              {!collapsed && <span>{t(item.label)}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 space-y-1 transition-colors">
        <Link
          to={settingsPath}
          className={`flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-300 text-base font-medium`}
          style={isActive(settingsPath) ? { backgroundColor: '#8D70FF1A', color: '#6942FF', fontWeight: '600' } : { color: '#525264' }}
          title={collapsed ? t('Settings') : ''}
        >
          <Gear size={25} className="shrink-0" />
          {!collapsed && <span>{t('Settings')}</span>}
        </Link>
        <button
          className="w-full flex items-center gap-3 px-3 py-3 transition-all duration-200 text-base font-medium cursor-pointer text-[#E46962]"
          title={collapsed ? t('Sign Out') : ''}
        >
          <SignOut size={25} className="shrink-0 rtl:rotate-180" />
          {!collapsed && <span>{t('Sign out')}</span>}
        </button>
      </div>
    </aside>
  )
}
