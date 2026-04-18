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
import LoginPage from '../pages/auth/LoginPage'

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
        element: <Settings />,
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
        element: <div className="p-8 h-full flex items-center justify-center"><h1 className="text-2xl font-bold text-secondary-500">Clients - Coming Soon</h1></div>,
      },
      {
        path: '/coach/programs',
        element: <div className="p-8 h-full flex items-center justify-center"><h1 className="text-2xl font-bold text-secondary-500">Programs - Coming Soon</h1></div>,
      },
      {
        path: '/coach/exercises',
        element: <div className="p-8 h-full flex items-center justify-center"><h1 className="text-2xl font-bold text-secondary-500">Exercises - Coming Soon</h1></div>,
      },
      {
        path: '/coach/schedule',
        element: <div className="p-8 h-full flex items-center justify-center"><h1 className="text-2xl font-bold text-secondary-500">Schedule - Coming Soon</h1></div>,
      },
      {
        path: '/coach/messaging',
        element: <div className="p-8 h-full flex items-center justify-center"><h1 className="text-2xl font-bold text-secondary-500">Messaging - Coming Soon</h1></div>,
      },
      {
        path: '/coach/settings',
        element: <Settings />, // Reuse admin settings for now
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
