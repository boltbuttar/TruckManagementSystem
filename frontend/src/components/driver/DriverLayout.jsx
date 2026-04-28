import React, { useState } from 'react'
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './DriverLayout.css'

const navItems = [
  { to: '/driver/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/driver/my-loads',   icon: '📦', label: 'My Loads' },
  { to: '/driver/earnings',   icon: '💰', label: 'Earnings' },
  { to: '/driver/profile',    icon: '👤', label: 'Profile' },
]

export default function DriverLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={`driver-layout ${collapsed ? 'driver-layout--collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className="driver-sidebar">
        <div className="driver-sidebar__top">
          <div className="driver-sidebar__logo">
            <span>🚛</span>
            {!collapsed && <span>Truck<span className="text-gradient">Flow</span></span>}
          </div>
          <button className="driver-sidebar__toggle" onClick={() => setCollapsed(c => !c)} aria-label="Toggle sidebar">
            {collapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="driver-sidebar__nav">
          {navItems.map(item => {
            const active = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`driver-nav-item ${active ? 'driver-nav-item--active' : ''}`}
                title={collapsed ? item.label : ''}
              >
                <span className="driver-nav-item__icon">{item.icon}</span>
                {!collapsed && <span className="driver-nav-item__label">{item.label}</span>}
                {active && !collapsed && <span className="driver-nav-item__dot" />}
              </Link>
            )
          })}
        </nav>

        <div className="driver-sidebar__bottom">
          <div className={`driver-sidebar__user ${collapsed ? 'collapsed' : ''}`}>
            <div className="driver-sidebar__avatar">{user?.name?.[0] || 'D'}</div>
            {!collapsed && (
              <div className="driver-sidebar__user-info">
                <span className="driver-sidebar__user-name">{user?.name}</span>
                <span className="driver-sidebar__user-role">Driver</span>
              </div>
            )}
          </div>
          <button className="driver-sidebar__logout" onClick={handleLogout} title="Logout">
            🚪{!collapsed && <span> Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="driver-main">
        <div className="driver-topbar">
          <div className="driver-topbar__breadcrumb">
            {navItems.find(n => n.to === location.pathname)?.label || 'Driver'}
          </div>
          <div className="driver-topbar__right">
            <div className="driver-topbar__time">
              {new Date().toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' })}
            </div>
            <div className="driver-topbar__avatar">{user?.name?.[0] || 'D'}</div>
          </div>
        </div>
        <div className="driver-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
