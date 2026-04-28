import React, { useState } from 'react'
import { useToast } from '../../context/ToastContext'
import './MyLoads.css'

const mockLoads = [
  {
    id: 'L001',
    pickup: { city: 'New York', state: 'NY', address: '123 Broadway' },
    delivery: { city: 'Boston', state: 'MA', address: '456 Beacon St' },
    startDate: '2026-04-28',
    endDate: '2026-04-28',
    distance: 215,
    status: 'completed',
    amount: 450,
    cargo: 'Electronics',
    weight: '5,200 lbs'
  },
  {
    id: 'L002',
    pickup: { city: 'Boston', state: 'MA', address: '456 Beacon St' },
    delivery: { city: 'Philadelphia', state: 'PA', address: '789 Market St' },
    startDate: '2026-04-27',
    endDate: '2026-04-27',
    distance: 305,
    status: 'completed',
    amount: 380,
    cargo: 'Furniture',
    weight: '8,500 lbs'
  },
  {
    id: 'L003',
    pickup: { city: 'Philadelphia', state: 'PA', address: '789 Market St' },
    delivery: { city: 'Washington', state: 'DC', address: '321 Constitution Ave' },
    startDate: '2026-04-26',
    endDate: '2026-04-26',
    distance: 140,
    status: 'in-transit',
    amount: 290,
    cargo: 'Office Supplies',
    weight: '3,200 lbs'
  },
  {
    id: 'L004',
    pickup: { city: 'Washington', state: 'DC', address: '321 Constitution Ave' },
    delivery: { city: 'Baltimore', state: 'MD', address: '100 Harbor St' },
    startDate: '2026-04-25',
    endDate: '2026-04-25',
    distance: 40,
    status: 'completed',
    amount: 180,
    cargo: 'General Cargo',
    weight: '2,000 lbs'
  },
  {
    id: 'L005',
    pickup: { city: 'Baltimore', state: 'MD', address: '100 Harbor St' },
    delivery: { city: 'Richmond', state: 'VA', address: '200 Main St' },
    startDate: '2026-04-24',
    endDate: '2026-04-24',
    distance: 110,
    status: 'completed',
    amount: 220,
    cargo: 'Auto Parts',
    weight: '4,500 lbs'
  }
]

export default function MyLoads() {
  const [loads] = useState(mockLoads)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const { addToast } = useToast()

  const filteredLoads = loads.filter(load => {
    if (filter !== 'all' && load.status !== filter) return false
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      return (
        load.pickup.city.toLowerCase().includes(search) ||
        load.delivery.city.toLowerCase().includes(search) ||
        load.id.toLowerCase().includes(search)
      )
    }
    return true
  })

  const stats = {
    total: loads.length,
    completed: loads.filter(l => l.status === 'completed').length,
    inTransit: loads.filter(l => l.status === 'in-transit').length,
    earnings: loads.reduce((sum, l) => sum + l.amount, 0)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'in-transit':
        return 'warning'
      case 'pending':
        return 'primary'
      default:
        return 'default'
    }
  }

  const handleLoadClick = (loadId) => {
    addToast(`Viewing load ${loadId}`, 'info')
  }

  return (
    <div className="my-loads">
      <h1>My Loads</h1>
      <p className="my-loads__subtitle">Track all your loads and earnings</p>

      {/* Stats */}
      <div className="my-loads__stats">
        <div className="stat-item">
          <span className="stat-item__label">Total Loads</span>
          <span className="stat-item__value">{stats.total}</span>
        </div>
        <div className="stat-item">
          <span className="stat-item__label">Completed</span>
          <span className="stat-item__value">{stats.completed}</span>
        </div>
        <div className="stat-item">
          <span className="stat-item__label">In Transit</span>
          <span className="stat-item__value">{stats.inTransit}</span>
        </div>
        <div className="stat-item">
          <span className="stat-item__label">Total Earnings</span>
          <span className="stat-item__value">${stats.earnings}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="my-loads__filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search by city or load ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`btn btn--sm ${filter === 'all' ? 'btn--primary' : 'btn--ghost'}`}
            onClick={() => setFilter('all')}
          >
            All Loads
          </button>
          <button
            className={`btn btn--sm ${filter === 'completed' ? 'btn--primary' : 'btn--ghost'}`}
            onClick={() => setFilter('completed')}
          >
            ✓ Completed
          </button>
          <button
            className={`btn btn--sm ${filter === 'in-transit' ? 'btn--primary' : 'btn--ghost'}`}
            onClick={() => setFilter('in-transit')}
          >
            → In Transit
          </button>
        </div>
      </div>

      {/* Loads List */}
      <div className="loads-list">
        {filteredLoads.length > 0 ? (
          filteredLoads.map(load => (
            <div
              key={load.id}
              className="load-item"
              onClick={() => handleLoadClick(load.id)}
            >
              <div className="load-item__header">
                <div className="load-item__route">
                  <div className="route-point">
                    <div className="route-point__city">{load.pickup.city}</div>
                    <div className="route-point__state">{load.pickup.state}</div>
                  </div>
                  <div className="route-arrow">→</div>
                  <div className="route-point">
                    <div className="route-point__city">{load.delivery.city}</div>
                    <div className="route-point__state">{load.delivery.state}</div>
                  </div>
                </div>
                <div className="load-item__amount">${load.amount}</div>
              </div>

              <div className="load-item__details">
                <div className="detail-col">
                  <span className="label">Load ID</span>
                  <span className="value">{load.id}</span>
                </div>
                <div className="detail-col">
                  <span className="label">Distance</span>
                  <span className="value">{load.distance} miles</span>
                </div>
                <div className="detail-col">
                  <span className="label">Weight</span>
                  <span className="value">{load.weight}</span>
                </div>
                <div className="detail-col">
                  <span className="label">Cargo</span>
                  <span className="value">{load.cargo}</span>
                </div>
                <div className="detail-col">
                  <span className="label">Date</span>
                  <span className="value">{new Date(load.startDate).toLocaleDateString()}</span>
                </div>
                <div className="detail-col">
                  <span className="label">Status</span>
                  <span className={`badge badge--${getStatusColor(load.status)}`}>
                    {load.status === 'completed' && '✓ Completed'}
                    {load.status === 'in-transit' && '→ In Transit'}
                    {load.status === 'pending' && '⏳ Pending'}
                  </span>
                </div>
              </div>

              <div className="load-item__footer">
                <div className="rate-info">
                  <span className="rate">${(load.amount / load.distance).toFixed(2)}/mi</span>
                </div>
                <button className="btn btn--ghost btn--sm">
                  View Details →
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon">📦</div>
            <h3>No loads found</h3>
            <p>Try adjusting your filters or search term</p>
          </div>
        )}
      </div>
    </div>
  )
}
