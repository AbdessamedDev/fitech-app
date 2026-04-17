import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '../components/shared/Sidebar'
import { Navbar } from '../components/shared/Navbar'

export default function AdminLayout() {
  const location = useLocation()
    
      const getPageTitle = () => {
          const titles = {
                '/admin/dashboard': 'Dashboard',
                  '/admin/members': 'Members',
                  '/admin/subscriptions': 'Subscriptions',
                  '/admin/finance': 'Finance',
                  '/admin/equipment': 'Equipment',
                  '/admin/reports': 'Reports',
                  '/admin/shop': 'Shop',
                  '/admin/settings': 'Settings',
                  '/admin': 'Dashboard'   }
                                                                        
                        return titles[location.pathname] || 'Dashboard'
                          }

return (
<div className="flex h-screen bg-secondary-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar title={getPageTitle()} />
            <main className="flex-1 overflow-y-auto">
                  <Outlet />
            </main>
      </div>
</div>
      )
}
                                                            