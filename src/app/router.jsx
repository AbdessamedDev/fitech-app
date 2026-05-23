import { createBrowserRouter } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import CoachLayout from '../layouts/CoachLayout'
import Dashboard from '../pages/admin/Dashboard'
import Members from '../pages/admin/Members'
import Subscriptions from '../pages/admin/Subscriptions'
import Finance from '../pages/admin/Finance'
import Equipment from '../pages/admin/Equipment'
import Reports from '../pages/admin/Reports'
import Shop from '../pages/admin/Shop'
import Settings from '../pages/admin/Settings'
import Clients from '../pages/coach/Clients'
import LoginPage from '../pages/auth/LoginPage'
import { useTranslation } from 'react-i18next'

function ComingSoonPage({ title }) {
  const { t } = useTranslation()

  return (
    <div className="p-8 h-full flex items-center justify-center">
      <h1 className="text-2xl font-bold text-secondary-500">{t(`${title} - Coming Soon`)}</h1>
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: '/admin',
        element: <Dashboard />,
      },
      {
        path: '/admin/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/admin/members',
        element: <Members />,
      },
      {
        path: '/admin/subscriptions',
        element: <Subscriptions />,
      },
      {
        path: '/admin/finance',
        element: <Finance />,
      },
      {
        path: '/admin/equipment',
        element: <Equipment />,
      },
      {
        path: '/admin/reports',
        element: <Reports />,
      },
      {
        path: '/admin/shop',
        element: <Shop />,
      },
      {
        path: '/admin/settings',
        element: <Settings scope="admin" />,
      },
    ],
  },
  {
    path: '/coach',
    element: <CoachLayout />,
    children: [
      {
        path: '/coach',
        element: <Dashboard />,
      },
      {
        path: '/coach/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/coach/clients',
        element: <Clients />,
      },
      {
        path: '/coach/programs',
        element: <ComingSoonPage title="Programs" />,
      },
      {
        path: '/coach/exercises',
        element: <ComingSoonPage title="Exercises" />,
      },
      {
        path: '/coach/schedule',
        element: <ComingSoonPage title="Schedule" />,
      },
      {
        path: '/coach/messaging',
        element: <ComingSoonPage title="Messaging" />,
      },
      {
        path: '/coach/settings',
        element: <Settings scope="coach" />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage/>,
  },
  {
    path: '/',
    element: <Dashboard />,
  }
])
