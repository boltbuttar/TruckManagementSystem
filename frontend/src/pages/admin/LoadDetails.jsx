import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'
import './LoadDetails.css'

// Mock data - replace with API call
const mockLoad = {
  id: 'TF-4821',
  pickup: 'Los Angeles, CA',
  delivery: 'Chicago, IL',
  pickupDate: '2026-04-27',
  deliveryDate: '2026-05-02',
  cargo: 'General Freight',
  weight: '42,000 lbs',
  truckType: 'Dry Van 53\'',
  driver: 'Marcus Thompson',
  driverId: 1,
  status: 'In Transit',
  rate: '$2,850.00',
  date: '2026-04-27',
  notes: 'Handle with care - fragile items on top. No overnight stops.',
  timeline: [
    { step: 'Order Placed', time: '2026-04-27 08:15 AM', completed: true },
    { step: 'Driver Assigned', time: '2026-04-27 08:45 AM', completed: true },
    { step: 'Pickup Confirmed', time: '2026-04-27 10:30 AM', completed: true },
    { step: 'In Transit', time: '2026-04-27 11:00 AM', completed: true },
    { step: 'Out for Delivery', time: 'Pending', completed: false },
    { step: 'Delivered', time: 'Pending', completed: false },
  ],
  location: {
    latitude: 41.8781,
    longitude: -87.6298,
  },
}

const statusColors = {
  'Pending': 'badge-warning',
  'In Transit': 'badge-info',
  'Delivered': 'badge-success',
  'Cancelled': 'badge-danger',
}

export default function LoadDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success, error } = useToast()
  const [load, setLoad] = useState(mockLoad)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState(load)

  const statusOptions = ['Pending', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled']

  const updateStatus = async (newStatus) => {
    try {
      setLoading(true)
      // TODO: Call API when backend is ready
      // await loads.updateStatus(id, newStatus)
      setLoad(l => ({ ...l, status: newStatus }))
      success(`Status updated to ${newStatus}`)
    } catch (err) {
      error(err.message || 'Failed to update status')
    } finally {
      setLoading(false)
    }
  }

  const saveChanges = async () => {
    try {
      setLoading(true)
      // TODO: Call API when backend is ready
      // await loads.update(id, formData)
      setLoad(formData)
      setShowForm(false)
      success('Load details updated')
    } catch (err) {
      error(err.message || 'Failed to save changes')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="load-details-page">
      <div className="load-details-header">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/loads')}>← Back to Loads</button>
        <div className="load-details-header__title">
          <h1>{load.id}</h1>
          <p className="load-details-header__meta">{load.pickup} → {load.delivery}</p>
        </div>
        <span className={`badge ${statusColors[load.status]}`}>{load.status}</span>
      </div>

      <div className="load-details-grid">
        {/* Main Info */}
        <div className="load-details-card">
          <h3 className="load-details-card__title">Load Information</h3>
          <div className="info-grid">
            <div className="info-row">
              <label>Pickup Location</label>
              <span>{load.pickup}</span>
            </div>
            <div className="info-row">
              <label>Delivery Location</label>
              <span>{load.delivery}</span>
            </div>
            <div className="info-row">
              <label>Pickup Date</label>
              <span>{load.pickupDate}</span>
            </div>
            <div className="info-row">
              <label>Delivery Date</label>
              <span>{load.deliveryDate}</span>
            </div>
            <div className="info-row">
              <label>Cargo Type</label>
              <span>{load.cargo}</span>
            </div>
            <div className="info-row">
              <label>Weight</label>
              <span>{load.weight}</span>
            </div>
            <div className="info-row">
              <label>Truck Type Required</label>
              <span>{load.truckType}</span>
            </div>
            <div className="info-row">
              <label>Rate</label>
              <span className="rate">{load.rate}</span>
            </div>
          </div>
        </div>

        {/* Driver Info */}
        <div className="load-details-card">
          <h3 className="load-details-card__title">Driver Assignment</h3>
          <div className="driver-card">
            <div className="driver-avatar">{load.driver[0]}</div>
            <div className="driver-info">
              <Link to={`/admin/drivers/${load.driverId}`} className="driver-name">{load.driver}</Link>
              <span className="badge badge-success">Active</span>
            </div>
          </div>
          {!showForm && (
            <button className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: 12 }}>
              Change Driver
            </button>
          )}
        </div>

        {/* Status Update */}
        <div className="load-details-card">
          <h3 className="load-details-card__title">Quick Actions</h3>
          <div className="action-grid">
            {statusOptions
              .filter(s => s !== load.status)
              .slice(0, 3)
              .map(s => (
                <button
                  key={s}
                  className="btn btn-outline btn-sm"
                  onClick={() => updateStatus(s)}
                  disabled={loading}
                >
                  {s}
                </button>
              ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="load-details-card load-details-card--full">
          <h3 className="load-details-card__title">Status Timeline</h3>
          <div className="timeline">
            {load.timeline.map((item, i) => (
              <div key={i} className={`timeline-item ${item.completed ? 'completed' : ''}`}>
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-step">{item.step}</div>
                  <div className="timeline-time">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="load-details-card load-details-card--full">
          <h3 className="load-details-card__title">Special Instructions</h3>
          <p className="notes-text">{load.notes}</p>
        </div>

        {/* Edit Form */}
        {showForm && (
          <div className="load-details-card load-details-card--full">
            <h3 className="load-details-card__title">Edit Load Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Cargo Type</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.cargo}
                  onChange={e => setFormData(f => ({ ...f, cargo: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Weight</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.weight}
                  onChange={e => setFormData(f => ({ ...f, weight: e.target.value }))}
                />
              </div>
              <div className="form-group form-group--full">
                <label className="form-label">Special Instructions</label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={formData.notes}
                  onChange={e => setFormData(f => ({ ...f, notes: e.target.value }))}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button className="btn btn-ghost" onClick={() => setShowForm(false)} disabled={loading}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={saveChanges} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {!showForm && (
          <div className="load-details-card load-details-card--full">
            <button className="btn btn-outline" onClick={() => setShowForm(true)} style={{ width: '100%' }}>
              ✏️ Edit Load Details
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
