import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import './MyProfile.css'

const mockProfile = {
  id: 'D001',
  name: 'John Smith',
  email: 'john.smith@example.com',
  phone: '(555) 123-4567',
  licenseNumber: 'DL123456',
  licenseExpiry: '2027-03-15',
  licenseClass: 'A',
  licenseState: 'NY',
  ssn: '***-**-1234',
  dateOfBirth: '1985-06-15',
  address: '123 Main Street',
  city: 'New York',
  state: 'NY',
  zip: '10001',
  companyName: 'Smith Transportation',
  truckMake: 'Peterbilt',
  truckModel: '579',
  truckYear: 2019,
  truckVIN: '1XPXM94L2ED295428',
  truckPlate: 'NYT-1234',
  rating: 4.8,
  completedLoads: 24,
  joinDate: '2024-01-15',
  insurance: {
    provider: 'ABC Insurance',
    policyNumber: 'POL-123456',
    expiryDate: '2027-06-30'
  },
  documents: [
    { id: 'DOC1', name: 'Driver License', status: 'verified', uploadDate: '2024-01-15' },
    { id: 'DOC2', name: 'Vehicle Registration', status: 'verified', uploadDate: '2024-01-16' },
    { id: 'DOC3', name: 'Insurance Certificate', status: 'verified', uploadDate: '2024-01-17' }
  ]
}

export default function MyProfile() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [profile, setProfile] = useState(mockProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(profile)

  const handleEdit = () => {
    setIsEditing(true)
    setEditData(profile)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleSave = () => {
    setProfile(editData)
    setIsEditing(false)
    addToast('Profile updated successfully!', 'success')
  }

  const handleInputChange = (field, value) => {
    setEditData({
      ...editData,
      [field]: value
    })
  }

  const DocumentItem = ({ doc }) => (
    <div className="document-item">
      <div className="document-info">
        <span className="document-name">{doc.name}</span>
        <span className="document-date">{new Date(doc.uploadDate).toLocaleDateString()}</span>
      </div>
      <span className={`badge badge--${doc.status === 'verified' ? 'success' : 'warning'}`}>
        {doc.status === 'verified' ? '✓ Verified' : '⏳ Pending'}
      </span>
    </div>
  )

  if (isEditing) {
    return (
      <div className="my-profile">
        <h1>Edit Profile</h1>

        <div className="profile-sections">
          {/* Personal Information */}
          <section className="profile-section">
            <h2>Personal Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={editData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={editData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={editData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  value={editData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>ZIP Code</label>
                <input
                  type="text"
                  value={editData.zip}
                  onChange={(e) => handleInputChange('zip', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </section>

          {/* License Information */}
          <section className="profile-section">
            <h2>License Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>License Number</label>
                <input
                  type="text"
                  value={editData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>License Class</label>
                <input
                  type="text"
                  value={editData.licenseClass}
                  onChange={(e) => handleInputChange('licenseClass', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="date"
                  value={editData.licenseExpiry}
                  onChange={(e) => handleInputChange('licenseExpiry', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </section>

          {/* Truck Information */}
          <section className="profile-section">
            <h2>Truck Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Make</label>
                <input
                  type="text"
                  value={editData.truckMake}
                  onChange={(e) => handleInputChange('truckMake', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Model</label>
                <input
                  type="text"
                  value={editData.truckModel}
                  onChange={(e) => handleInputChange('truckModel', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Year</label>
                <input
                  type="number"
                  value={editData.truckYear}
                  onChange={(e) => handleInputChange('truckYear', parseInt(e.target.value))}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>VIN</label>
                <input
                  type="text"
                  value={editData.truckVIN}
                  onChange={(e) => handleInputChange('truckVIN', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>License Plate</label>
                <input
                  type="text"
                  value={editData.truckPlate}
                  onChange={(e) => handleInputChange('truckPlate', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="profile-actions">
            <button className="btn btn--primary" onClick={handleSave}>
              ✓ Save Changes
            </button>
            <button className="btn btn--ghost" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="my-profile">
      <div className="profile-header">
        <div className="profile-header-content">
          <h1>{profile.name}</h1>
          <p className="profile-subtitle">Driver ID: {profile.id}</p>
        </div>
        <button className="btn btn--primary" onClick={handleEdit}>
          ✎ Edit Profile
        </button>
      </div>

      <div className="profile-sections">
        {/* Quick Stats */}
        <section className="profile-section profile-section--full">
          <div className="quick-stats-grid">
            <div className="quick-stat">
              <span className="quick-stat-label">Rating</span>
              <span className="quick-stat-value">⭐ {profile.rating}</span>
            </div>
            <div className="quick-stat">
              <span className="quick-stat-label">Completed Loads</span>
              <span className="quick-stat-value">{profile.completedLoads}</span>
            </div>
            <div className="quick-stat">
              <span className="quick-stat-label">Member Since</span>
              <span className="quick-stat-value">{new Date(profile.joinDate).toLocaleDateString()}</span>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="profile-section">
          <h2>Contact Information</h2>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{profile.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone</span>
              <span className="info-value">{profile.phone}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Address</span>
              <span className="info-value">
                {profile.address}, {profile.city}, {profile.state} {profile.zip}
              </span>
            </div>
          </div>
        </section>

        {/* License Information */}
        <section className="profile-section">
          <h2>License Information</h2>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">License Number</span>
              <span className="info-value">{profile.licenseNumber}</span>
            </div>
            <div className="info-item">
              <span className="info-label">License Class</span>
              <span className="info-value">{profile.licenseClass}</span>
            </div>
            <div className="info-item">
              <span className="info-label">State</span>
              <span className="info-value">{profile.licenseState}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Expiry Date</span>
              <span className={profile.licenseExpiry > new Date().toISOString().split('T')[0] ? 'info-value--success' : 'info-value--danger'}>
                {new Date(profile.licenseExpiry).toLocaleDateString()}
              </span>
            </div>
          </div>
        </section>

        {/* Truck Information */}
        <section className="profile-section">
          <h2>Truck Information</h2>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Vehicle</span>
              <span className="info-value">{profile.truckYear} {profile.truckMake} {profile.truckModel}</span>
            </div>
            <div className="info-item">
              <span className="info-label">VIN</span>
              <span className="info-value">{profile.truckVIN}</span>
            </div>
            <div className="info-item">
              <span className="info-label">License Plate</span>
              <span className="info-value">{profile.truckPlate}</span>
            </div>
          </div>
        </section>

        {/* Insurance Information */}
        <section className="profile-section">
          <h2>Insurance Information</h2>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Provider</span>
              <span className="info-value">{profile.insurance.provider}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Policy Number</span>
              <span className="info-value">{profile.insurance.policyNumber}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Expiry Date</span>
              <span className="info-value">{new Date(profile.insurance.expiryDate).toLocaleDateString()}</span>
            </div>
          </div>
        </section>

        {/* Documents */}
        <section className="profile-section profile-section--full">
          <h2>Documents & Verification</h2>
          <div className="documents-list">
            {profile.documents.map(doc => (
              <DocumentItem key={doc.id} doc={doc} />
            ))}
          </div>
          <button className="btn btn--ghost btn--sm">
            + Upload New Document
          </button>
        </section>

        {/* Password & Security */}
        <section className="profile-section profile-section--full">
          <h2>Security</h2>
          <div className="security-section">
            <div className="security-item">
              <div>
                <h3>Change Password</h3>
                <p>Update your account password</p>
              </div>
              <button className="btn btn--ghost">Change</button>
            </div>
            <div className="security-item">
              <div>
                <h3>Two-Factor Authentication</h3>
                <p>Add an extra layer of security</p>
              </div>
              <button className="btn btn--ghost">Enable</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
