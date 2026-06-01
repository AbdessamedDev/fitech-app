import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Sidebar } from '../components/shared/Sidebar'
import { Navbar } from '../components/shared/Navbar'
import { applyScopedLanguage, applyScopedTheme } from '../components/settings/settingsPreferences'

export default function CoachLayout() {
  const location = useLocation()
  const { i18n } = useTranslation()

  useEffect(() => {
    applyScopedLanguage(i18n, 'coach')
    applyScopedTheme('coach')
  }, [i18n])
    
  const getPageTitle = () => {
    const titles = {
      '/coach/dashboard': 'Profile',
      '/coach/clients': 'Clients',
      '/coach/schedule': 'Schedule',
      '/coach/messaging': 'Messaging',
      '/coach/settings': 'Settings',
      '/coach': 'Profile'
    }
                                                                        
    if (location.pathname.startsWith('/coach/programs')) return 'Programs'

    return titles[location.pathname] || 'Profile'
  }

  return (
    <div className="flex h-screen bg-secondary-50">
      <Sidebar role="coach" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title={getPageTitle()} role="coach" />
        <main className="flex-1 overflow-y-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
