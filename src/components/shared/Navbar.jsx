import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { CaretRight, Moon, SunDim, Bell, Gear } from "../../icons/index"
import Logo from "../../assets/Logo.png"
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { getUserDisplayName } from '../../features/auth/utils/authHelpers';

export function Navbar({ title = 'Dashboard', hasNotification = true, role = 'admin' }) {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => observer.disconnect()
  }, [])

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark')
  }

  const profilePath = role === 'coach' ? '/coach/dashboard' : '/admin/profile'

  const actions = [
    { icon: isDark ? SunDim : Moon, size: 18, onClick: toggleDark },
    { icon: Gear, size: 18 },
    { icon: Bell, size: 18, isBell: true },
  ]

  return (
    <nav className="bg-secondary-50 px-8 py-3 flex items-center justify-between border-b border-b-secondary-300">
      
      <div className="flex items-center gap-3">
        <h1 className="flex items-center font-normal text-secondary-500">
          <span className='order-2 text-base'>{title !== 'Dashboard' ? t(title) : t('Dashboard')}</span>
          <CaretRight size={16} weight="bold" className="rtl:rotate-180" />
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {actions.map((Item, index) => {
          const Icon = Item.icon

          return (
            <button
              key={index}
              onClick={Item.onClick}
              className="relative bg-primary-50 p-1.5 rounded-md transition-colors cursor-pointer hover:bg-primary-200"
            >
              <Icon size={Item.size} className="text-primary-600" />

              {Item.isBell && hasNotification && (
                <span className="absolute top-1/5 ltr:right-2.25 rtl:left-2.25 w-1.25 h-1.25 bg-red-500 rounded-full"></span>
              )}
            </button>
          )
        })}

        <Link
          to={profilePath}
          className="flex items-center gap-2 rounded-md px-1.5 py-1 ltr:ml-2 rtl:mr-2 transition-all duration-300 hover:bg-primary-50 hover:shadow-[0_6px_16px_rgba(105,66,255,0.10)]"
        >
          <img
            src={Logo} 
            alt="Profile"
            className="w-8.25 h-8.25 rounded-full object-cover"
          />

          <div className="text-left rtl:text-right">
            <p className="text-sm font-medium text-secondary-700">
              {getUserDisplayName(user)}
            </p>
            <p className="text-xs font-normal text-secondary-500">
              {t(role === 'coach' ? 'Coach' : 'Admin')}
            </p>
          </div>
        </Link>
      </div>
    </nav>
  )
}
