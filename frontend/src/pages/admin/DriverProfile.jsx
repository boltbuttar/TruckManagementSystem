import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import './DriverProfile.css'

// Mock data - replace with API call
const mockDriver = {
  id: 1,
  name: 'Marcus Thompson',
  email: 'marcus@email.com',
  phone: '+1 555-0101',
  cdl: 'A1234567',
  cdlExpiry: '2026-12-15',
  truck: 'Dry Van 53\'',
  truckPlate: 'TX-42891',
  state: 'Texas',
  status: 'Active',
  joinDate: '2024-01-15',
  loads: 142,
  revenue: '$12,450',
  rating: 4.8,
  documents: [
    { name: 'CDL', verified: true, date: '2024-01-15' },
    { name: 'Insurance', verified: true, date: '2024-02-20' },
    { name: 'Medical Cert', verified: true, date: '2024-03-10' },
  ],
  recentLoads: [
    { id: 'TF-4821', route: 'LA → Chicago', status: 'In Transit', date: '2026-04-27' },
    { id: 'TF-4820', route: 'NYC → Miami', status: 'Delivered', date: '2026-04-26' },
    { id: 'TF-4819', route: 'Dallas → Denver', status: 'Completed', date: '2026-04-25' },
  ],
}

export default function DriverProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [driver, setDriver] = useState(mockDriver)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // TODO: Replace with API call when backend is ready
  // useEffect(() => {
  //   fetchDriver()
  // }, [id])

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/drivers')}>← Back to Drivers</button>
        <div className="profile-header__title">
          <div className="profile-avatar large">{driver.name[0]}</div>
          <div>
            <h1>{driver.name}</h1>
            <p className="profile-header__meta">CDL: {driver.cdl} • {driver.state}</p>
          </div>
        </div>
        <span className={`badge badge-${driver.status === 'Active' ? 'success' : 'neutral'}`}>{driver.status}</span>
      </div>

      <div className="profile-grid">
        {/* Quick Stats */}
        <div className="profile-card">
          <h3 className="profile-card__title">Overview</h3>
          <div className="stat-grid">
            <div className="stat-item">
              <span className="stat-label">Loads Completed</span>
              <span className="stat-value">{driver.loads}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Revenue</span>
              <span className="stat-value">{driver.revenue}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Rating</span>
              <span className="stat-value">⭐ {driver.rating}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Member Since</span>
              <span className="stat-value">{driver.joinDate}</span>
            </div>
          </div>
        </div>

        {/* Contact & Truck Info */}
        <div className="profile-card">
          <h3 className="profile-card__title">Contact & Vehicle</h3>
          <div className="info-list">
            <div className="info-item">
              <label>Email</label>
              <span>{driver.email}</span>
            </div>
            <div className="info-item">
              <label>Phone</label>
              <span>{driver.phone}</span>
            </div>
            <div className="info-item">
              <label>Truck Type</label>
              <span>{driver.truck}</span>
            </div>
            <div className="info-item">
              <label>License Plate</label>
              <span>{driver.truckPlate}</span>
            </div>
            <div className="info-item">
              <label>CDL Expiry</label>
              <span>{driver.cdlExpiry}</span>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="profile-card">
          <h3 className="profile-card__title">Documents & Compliance</h3>
          <div className="document-list">
            {driver.documents.map(doc => (
              <div key={doc.name} className="document-item">
                <div>
                  <span className="document-name">{doc.name}</span>
                  <span className="document-date">{doc.date}</span>
                </div>
                <span className={`badge ${doc.verified ? 'badge-success' : 'badge-warning'}`}>
                  {doc.verified ? '✅ Verified' : '⏳ Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Loads */}
        <div className="profile-card profile-card--full">
          <h3 className="profile-card__title">Recent Loads</h3>
          <div className="loads-table">
            <table>
              <thead>
                <tr>
                  <th>Load ID</th>
                  <th>Route</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {driver.recentLoads.map(load => (
                  <tr key={load.id}>
                    <td className="mono">{load.id}</td>
                    <td>{load.route}</td>
                    <td><span className="badge badge-info">{load.status}</span></td>
                    <td className="text-muted">{load.date}</td>
                    <td>
                      <Link to={`/admin/loads/${load.id}`} className="btn btn-ghost btn-xs">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
