import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { analytics } from '../../services/api'
import './Dashboard.css'

const statusClass = {
  'In Transit': 'badge-info',
  'Delivered':  'badge-success',
  'Pending':    'badge-warning',
  'Cancelled':  'badge-danger',
}

const colorVar = {
  orange:  'rgba(255,107,43,0.12)',
  yellow:  'rgba(255,184,0,0.12)',
  info:    'rgba(77,158,255,0.12)',
  success: 'rgba(34,211,160,0.12)',
}
const borderVar = {
  orange:  'rgba(255,107,43,0.3)',
  yellow:  'rgba(255,184,0,0.3)',
  info:    'rgba(77,158,255,0.3)',
  success: 'rgba(34,211,160,0.3)',
}

export default function Dashboard() {
  const [kpis, setKpis] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        const response = await analytics.getDashboard()
        const { kpis: kpiData, recentActivity: activity } = response.data

        const formattedKpis = [
          { icon: '🧑‍✈️', label: 'Total Drivers',    value: kpiData.totalDrivers,   change: `${kpiData.availableDrivers} available`, color: 'orange', to: '/admin/drivers' },
          { icon: '📦', label: 'Active Loads',      value: kpiData.completedLoads,    change: `${kpiData.totalLoads} total`,    color: 'yellow', to: '/admin/loads' },
          { icon: '📋', label: 'Pending Requests',  value: 0,    change: 'Check requests',        color: 'info',   to: '/admin/requests' },
          { icon: '💰', label: 'Revenue (Month)',   value: `$${kpiData.totalRevenue?.toLocaleString() || 0}`, change: 'From completed loads', color: 'success', to: '#' },
        ]
        setKpis(formattedKpis)

        const formattedActivity = activity.slice(0, 5).map(a => ({
          id: a.id || 'N/A',
          driver: a.type === 'Load Assignment' ? (a.description.split(' to ')[1]?.split(' by ')[0] || 'System') : 'System',
          route: a.description || 'N/A',
          status: a.status || 'Pending',
          time: new Date(a.timestamp).toLocaleString()
        }))
        setRecentActivity(formattedActivity)
        setError(null)
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard data')
        console.error('Failed to fetch dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])
  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1 className="dashboard__title">Good morning 👋</h1>
          <p className="dashboard__sub">Here's what's happening with your fleet today.</p>
          {error && <p style={{color: 'var(--danger)', marginTop: 4, fontSize: '0.9em'}}>Error: {error}</p>}
          {loading && <p style={{marginTop: 4, fontSize: '0.9em'}}>Loading dashboard data...</p>}
        </div>
        <Link to="/admin/loads" className="btn btn-primary">+ Assign New Load</Link>
      </div>

      {/* KPI Cards */}
      <div className="dashboard__kpis">
        {kpis.map((k, i) => (
          <Link to={k.to} key={i} className="kpi-card" style={{ background: colorVar[k.color], borderColor: borderVar[k.color] }}>
            <div className="kpi-card__icon">{k.icon}</div>
            <div className="kpi-card__body">
              <div className="kpi-card__val">{k.value}</div>
              <div className="kpi-card__label">{k.label}</div>
              <div className="kpi-card__change">{k.change}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Status Distribution */}
      <div className="dashboard__mid">
        <div className="dash-card dash-card--activity">
          <div className="dash-card__header">
            <h3>Recent Dispatch Activity</h3>
            <Link to="/admin/dispatch" className="btn btn-ghost btn-sm">View All</Link>
          </div>
          <div className="activity-table">
            <div className="activity-table__head">
              <span>Load ID</span><span>Driver</span><span>Route</span><span>Status</span><span>Time</span>
            </div>
            {recentActivity.map((r, i) => (
              <div key={i} className="activity-table__row">
                <span className="activity-id">{r.id}</span>
                <span>{r.driver}</span>
                <span className="activity-route">{r.route}</span>
                <span><span className={`badge ${statusClass[r.status]}`}>{r.status}</span></span>
                <span className="activity-time">{r.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-card dash-card--stats">
          <div className="dash-card__header"><h3>Load Status Overview</h3></div>
          <div className="status-overview">
            {[
              { label: 'In Transit', pct: 40, color: '#4D9EFF' },
              { label: 'Delivered',  pct: 35, color: '#22D3A0' },
              { label: 'Pending',    pct: 18, color: '#FFB800' },
              { label: 'Cancelled',  pct: 7,  color: '#FF4D6A' },
            ].map((s, i) => (
              <div key={i} className="status-row">
                <div className="status-row__info">
                  <span>{s.label}</span>
                  <span className="status-row__pct">{s.pct}%</span>
                </div>
                <div className="status-row__bar">
                  <div className="status-row__fill" style={{ width: `${s.pct}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="dash-card__header" style={{ marginTop:32 }}><h3>Quick Actions</h3></div>
          <div className="quick-actions">
            <Link to="/admin/drivers"  className="quick-action">🧑‍✈️<span>Add Driver</span></Link>
            <Link to="/admin/loads"    className="quick-action">📦<span>New Load</span></Link>
            <Link to="/admin/requests" className="quick-action">📋<span>Requests</span></Link>
            <Link to="/admin/dispatch" className="quick-action">🗺️<span>Dispatch</span></Link>
          </div>
        </div>
      </div>
    </div>
  )
}
