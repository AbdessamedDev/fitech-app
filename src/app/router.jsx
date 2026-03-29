import { createBrowserRouter } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
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
    path: '/login',
    element: <LoginPage/>,
  },
  {
    path: '/',
    element: <Dashboard />,
  }
])
