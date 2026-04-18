import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '../components/shared/Sidebar'
import { Navbar } from '../components/shared/Navbar'

export default function CoachLayout() {
  const location = useLocation()
    
  const getPageTitle = () => {
    const titles = {
      '/coach/dashboard': 'Dashboard',
      '/coach/clients': 'Clients',
      '/coach/programs': 'Programs',
      '/coach/exercises': 'Exercises',
      '/coach/schedule': 'Schedule',
      '/coach/messaging': 'Messaging',
      '/coach/settings': 'Settings',
      '/coach': 'Dashboard'
    }
                                                                        
    return titles[location.pathname] || 'Dashboard'
  }

  return (
    <div className="flex h-screen bg-secondary-50">
      <Sidebar role="coach" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title={getPageTitle()} />
        <main className="flex-1 overflow-y-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
