import React, { useState } from 'react'
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './AdminLayout.css'

const navItems = [
  { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/admin/drivers',   icon: '🧑‍✈️', label: 'Drivers' },
  { to: '/admin/loads',     icon: '📦', label: 'Loads' },
  { to: '/admin/requests',  icon: '📋', label: 'Requests' },
  { to: '/admin/dispatch',  icon: '🗺️', label: 'Dispatch' },
]

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate  = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className={`admin-layout ${collapsed ? 'admin-layout--collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__top">
          <div className="admin-sidebar__logo">
            <span>🚛</span>
            {!collapsed && <span>Truck<span className="text-gradient">Flow</span></span>}
          </div>
          <button className="admin-sidebar__toggle" onClick={() => setCollapsed(c => !c)} aria-label="Toggle sidebar">
            {collapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          {navItems.map(item => {
            const active = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`admin-nav-item ${active ? 'admin-nav-item--active' : ''}`}
                title={collapsed ? item.label : ''}
              >
                <span className="admin-nav-item__icon">{item.icon}</span>
                {!collapsed && <span className="admin-nav-item__label">{item.label}</span>}
                {active && !collapsed && <span className="admin-nav-item__dot" />}
              </Link>
            )
          })}
        </nav>

        <div className="admin-sidebar__bottom">
          <div className={`admin-sidebar__user ${collapsed ? 'collapsed' : ''}`}>
            <div className="admin-sidebar__avatar">{user?.name?.[0] || 'A'}</div>
            {!collapsed && (
              <div className="admin-sidebar__user-info">
                <span className="admin-sidebar__user-name">{user?.name}</span>
                <span className="admin-sidebar__user-role">Administrator</span>
              </div>
            )}
          </div>
          <button className="admin-sidebar__logout" onClick={handleLogout} title="Logout">
            🚪{!collapsed && <span> Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar__breadcrumb">
            {navItems.find(n => n.to === location.pathname)?.label || 'Admin'}
          </div>
          <div className="admin-topbar__right">
            <div className="admin-topbar__time">
              {new Date().toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' })}
            </div>
            <div className="admin-topbar__avatar">{user?.name?.[0] || 'A'}</div>
          </div>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
