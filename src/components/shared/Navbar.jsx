import { useState, useEffect } from "react"
import { CaretRight, Moon, SunDim, Bell, Gear } from "../../icons/index"
import Logo from "../../assets/Logo.png"
import { useTranslation } from 'react-i18next';

export function Navbar({ title = 'Dashboard', hasNotification = true }) {
  const { t } = useTranslation();

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

        <div className="flex items-center gap-2 ltr:ml-2 rtl:mr-2">
          <img
            src={Logo} 
            alt="Profile"
            className="w-8.25 h-8.25 rounded-full object-cover"
          />

          <div className="text-left rtl:text-right">
            <p className="text-sm font-medium text-secondary-700">
              Olivia Buckhorton
            </p>
            <p className="text-xs font-normal text-secondary-500">
              {t('Admin')}
            </p>
          </div>
        </div>
      </div>
    </nav>
  )
}