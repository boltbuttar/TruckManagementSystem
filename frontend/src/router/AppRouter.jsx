import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { ToastProvider } from '../context/ToastContext'

// User pages
import Home       from '../pages/user/Home'
import Services   from '../pages/user/Services'
import GetQuote   from '../pages/user/GetQuote'
import Login      from '../pages/user/Login'
import Register   from '../pages/user/Register'

// Admin pages
import AdminLogin  from '../pages/admin/AdminLogin'
import Dashboard   from '../pages/admin/Dashboard'
import Drivers     from '../pages/admin/Drivers'
import Loads       from '../pages/admin/Loads'
import Requests    from '../pages/admin/Requests'
import Dispatch    from '../pages/admin/Dispatch'
import DriverProfile from '../pages/admin/DriverProfile'
import LoadDetails from '../pages/admin/LoadDetails'

// Admin layout wrapper
import AdminLayout from '../components/admin/AdminLayout'

// Driver layout wrapper
import DriverLayout from '../components/driver/DriverLayout'

// Driver pages
import DriverDashboard from '../pages/driver/DriverDashboard'
import MyLoads from '../pages/driver/MyLoads'
import MyEarnings from '../pages/driver/MyEarnings'
import MyProfile from '../pages/driver/MyProfile'

const AdminGuard = ({ children }) => {
  const { user, isAdmin } = useAuth()
  if (!user) return <Navigate to="/admin/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}

const DriverGuard = ({ children }) => {
  const { user, isDriver } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!isDriver && !user.role?.includes('driver')) return <Navigate to="/" replace />
  return children
}

const AppRouter = () => (
  <AuthProvider>
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Public / User routes */}
          <Route path="/"          element={<Home />} />
          <Route path="/services"  element={<Services />} />
          <Route path="/get-quote" element={<GetQuote />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />

          {/* Admin auth */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected admin routes */}
          <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
            <Route index                   element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard"        element={<Dashboard />} />
            <Route path="drivers"          element={<Drivers />} />
            <Route path="drivers/:id"      element={<DriverProfile />} />
            <Route path="loads"            element={<Loads />} />
            <Route path="loads/:id"        element={<LoadDetails />} />
            <Route path="requests"         element={<Requests />} />
            <Route path="dispatch"         element={<Dispatch />} />
          </Route>

          {/* Protected driver routes */}
          <Route path="/driver" element={<DriverGuard><DriverLayout /></DriverGuard>}>
            <Route index                   element={<Navigate to="/driver/dashboard" replace />} />
            <Route path="dashboard"        element={<DriverDashboard />} />
            <Route path="my-loads"         element={<MyLoads />} />
            <Route path="earnings"         element={<MyEarnings />} />
            <Route path="profile"          element={<MyProfile />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  </AuthProvider>
)

export default AppRouter
