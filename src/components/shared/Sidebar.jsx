import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from "../../assets/Logo.png";
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
  SignOut                

} from '../../icons/index'

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: SquaresFourIcon },
    { label: 'Members', path: '/admin/members', icon: Users },
    { label: 'Subscriptions', path: '/admin/subscriptions', icon: IdentificationCard },
    { label: 'Finance', path: '/admin/finance', icon: Money },
    { label: 'Equipment', path: '/admin/equipment', icon: BarbellIcon },
    { label: 'Reports', path: '/admin/reports', icon: FileText },
    { label: 'Shop', path: '/admin/shop', icon: ShoppingCart },
  ]

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
            <span className="font-bold text-xl text-secondary-900">FitTech</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-md transition-colors shrink-0 cursor-pointer"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <CaretRight size={20} /> : <List size={20} />}
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
              title={collapsed ? item.label : ''}
            >
              <Icon size={25} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 space-y-1 transition-colors">
        <Link
          to="/admin/settings"
          className={`flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-300 text-base font-medium`}
          style={isActive('/admin/settings') ? { backgroundColor: '#8D70FF1A', color: '#6942FF', fontWeight: '600' } : { color: '#525264' }}
          title={collapsed ? 'Settings' : ''}
        >
          <Gear size={25} className="shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
        <button
          className="w-full flex items-center gap-3 px-3 py-3 transition-all duration-200 text-base font-medium cursor-pointer text-[#E46962]"
          title={collapsed ? 'Sign Out' : ''}
        >
          <SignOut size={25} className="shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  )
}
