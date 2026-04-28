const User = require('../models/User')

// @desc  Get all drivers (admin)
// @route GET /api/drivers
const getDrivers = async (req, res) => {
  try {
    const { status, search } = req.query
    const query = { role: 'driver' }
    if (status) query.status = status
    if (search) query.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }]

    const drivers = await User.find(query).select('-password').sort({ createdAt: -1 })
    res.json({ success: true, count: drivers.length, data: drivers })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// @desc  Get single driver
// @route GET /api/drivers/:id
const getDriver = async (req, res) => {
  try {
    const driver = await User.findById(req.params.id).select('-password')
    if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' })
    res.json({ success: true, data: driver })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// @desc  Create driver (admin)
// @route POST /api/drivers
const createDriver = async (req, res) => {
  try {
    const driver = await User.create({ ...req.body, role: 'driver' })
    res.status(201).json({ success: true, data: driver })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

// @desc  Update driver
// @route PUT /api/drivers/:id
const updateDriver = async (req, res) => {
  try {
    const { password, ...updates } = req.body   // prevent password update via this route
    const driver = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password')
    if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' })
    res.json({ success: true, data: driver })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

// @desc  Delete driver
// @route DELETE /api/drivers/:id
const deleteDriver = async (req, res) => {
  try {
    const driver = await User.findByIdAndDelete(req.params.id)
    if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' })
    res.json({ success: true, message: 'Driver removed' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getDrivers, getDriver, createDriver, updateDriver, deleteDriver }
