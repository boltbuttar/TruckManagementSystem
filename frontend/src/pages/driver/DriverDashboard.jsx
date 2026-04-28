import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import './DriverDashboard.css'

// Mock data - replace with API calls
const mockDriverStats = {
  completedLoads: 24,
  activeLoads: 2,
  totalEarnings: 12450,
  rating: 4.8,
  availableLoads: 5,
  monthlyEarnings: 3200
}

const mockRecentLoads = [
  {
    id: 'L001',
    pickup: 'New York, NY',
    delivery: 'Boston, MA',
    date: '2026-04-28',
    status: 'completed',
    amount: 450,
    distance: 215
  },
  {
    id: 'L002',
    pickup: 'Boston, MA',
    delivery: 'Philadelphia, PA',
    date: '2026-04-27',
    status: 'completed',
    amount: 380,
    distance: 305
  },
  {
    id: 'L003',
    pickup: 'Philadelphia, PA',
    delivery: 'Washington, DC',
    date: '2026-04-26',
    status: 'in-transit',
    amount: 290,
    distance: 140
  }
]

const mockAvailableLoads = [
  {
    id: 'AV001',
    pickup: 'Washington, DC',
    delivery: 'Atlanta, GA',
    date: '2026-04-29',
    rate: 520,
    distance: 640,
    weight: '12,500 lbs'
  },
  {
    id: 'AV002',
    pickup: 'Atlanta, GA',
    delivery: 'Miami, FL',
    date: '2026-04-30',
    rate: 480,
    distance: 660,
    weight: '15,000 lbs'
  },
  {
    id: 'AV003',
    pickup: 'Charlotte, NC',
    delivery: 'Richmond, VA',
    date: '2026-04-29',
    rate: 280,
    distance: 300,
    weight: '8,000 lbs'
  }
]

export default function DriverDashboard() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [acceptedLoads, setAcceptedLoads] = useState([])

  const handleAcceptLoad = (load) => {
    setAcceptedLoads([...acceptedLoads, load])
    addToast(`Load ${load.id} accepted!`, 'success')
  }

  const StatCard = ({ icon, title, value, subtitle, color }) => (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__content">
        <span className="stat-card__title">{title}</span>
        <span className="stat-card__value">{value}</span>
        {subtitle && <span className="stat-card__subtitle">{subtitle}</span>}
      </div>
    </div>
  )

  return (
    <div className="driver-dashboard">
      <h1>Welcome back, {user?.name}!</h1>
      <p className="driver-dashboard__subtitle">Track your loads and earnings</p>

      {/* Stats Grid */}
      <div className="driver-dashboard__stats">
        <StatCard icon="✓" title="Completed Loads" value={mockDriverStats.completedLoads} color="success" />
        <StatCard icon="📦" title="Active Loads" value={mockDriverStats.activeLoads} color="warning" />
        <StatCard icon="💰" title="Total Earnings" value={`$${mockDriverStats.totalEarnings.toLocaleString()}`} color="primary" />
        <StatCard icon="⭐" title="Rating" value={mockDriverStats.rating} subtitle="Based on 24 loads" color="accent" />
      </div>

      <div className="driver-dashboard__sections">
        {/* Recent Loads */}
        <section className="dashboard-section">
          <div className="dashboard-section__header">
            <h2>Recent Loads</h2>
            <a href="/driver/my-loads" className="btn btn--ghost btn--sm">
              View All →
            </a>
          </div>
          <div className="loads-table">
            <div className="loads-table__header">
              <div className="loads-table__col">Route</div>
              <div className="loads-table__col">Date</div>
              <div className="loads-table__col">Distance</div>
              <div className="loads-table__col">Amount</div>
              <div className="loads-table__col">Status</div>
            </div>
            {mockRecentLoads.map(load => (
              <div key={load.id} className="loads-table__row">
                <div className="loads-table__col">
                  <div className="load-route">
                    <span className="load-route__pickup">{load.pickup}</span>
                    <span className="load-route__arrow">→</span>
                    <span className="load-route__delivery">{load.delivery}</span>
                  </div>
                </div>
                <div className="loads-table__col">{new Date(load.date).toLocaleDateString()}</div>
                <div className="loads-table__col">{load.distance} mi</div>
                <div className="loads-table__col">${load.amount}</div>
                <div className="loads-table__col">
                  <span className={`badge badge--${load.status === 'completed' ? 'success' : 'warning'}`}>
                    {load.status === 'completed' ? 'Completed' : 'In Transit'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Available Loads */}
        <section className="dashboard-section">
          <div className="dashboard-section__header">
            <h2>Available Loads ({mockAvailableLoads.length})</h2>
            <a href="/driver/my-loads" className="btn btn--ghost btn--sm">
              Browse More →
            </a>
          </div>
          <div className="available-loads">
            {mockAvailableLoads.map(load => (
              <div key={load.id} className="load-card">
                <div className="load-card__header">
                  <div>
                    <h3>{load.pickup}</h3>
                    <p className="text-muted">→ {load.delivery}</p>
                  </div>
                  <div className="load-card__rate">${load.rate}</div>
                </div>

                <div className="load-card__details">
                  <div className="load-detail">
                    <span className="label">Distance</span>
                    <span className="value">{load.distance} mi</span>
                  </div>
                  <div className="load-detail">
                    <span className="label">Weight</span>
                    <span className="value">{load.weight}</span>
                  </div>
                  <div className="load-detail">
                    <span className="label">Date</span>
                    <span className="value">{new Date(load.date).toLocaleDateString()}</span>
                  </div>
                  <div className="load-detail">
                    <span className="label">$/mi</span>
                    <span className="value">${(load.rate / load.distance).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  className="btn btn--primary btn--block"
                  onClick={() => handleAcceptLoad(load)}
                  disabled={acceptedLoads.some(l => l.id === load.id)}
                >
                  {acceptedLoads.some(l => l.id === load.id) ? '✓ Accepted' : 'Accept Load'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="dashboard-section">
          <h2>Quick Stats</h2>
          <div className="quick-stats">
            <div className="quick-stat">
              <span className="quick-stat__label">This Month</span>
              <span className="quick-stat__value">${mockDriverStats.monthlyEarnings}</span>
            </div>
            <div className="quick-stat">
              <span className="quick-stat__label">Avg per Load</span>
              <span className="quick-stat__value">${Math.round(mockDriverStats.totalEarnings / mockDriverStats.completedLoads)}</span>
            </div>
            <div className="quick-stat">
              <span className="quick-stat__label">Response Time</span>
              <span className="quick-stat__value">&lt; 2 mins</span>
            </div>
            <div className="quick-stat">
              <span className="quick-stat__label">Acceptance Rate</span>
              <span className="quick-stat__value">92%</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
