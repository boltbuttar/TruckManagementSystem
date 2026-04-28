const Load = require('../models/Load')

// GET /api/loads
const getLoads = async (req, res) => {
  try {
    const { status, driver, search } = req.query
    const query = {}
    if (status) query.status = status
    if (driver) query.driver = driver
    if (search) query.$or = [
      { loadId:   new RegExp(search, 'i') },
      { pickup:   new RegExp(search, 'i') },
      { delivery: new RegExp(search, 'i') },
    ]
    const loads = await Load.find(query).populate('driver', 'name email').populate('requestedBy', 'name email').sort({ createdAt: -1 })
    res.json({ success: true, count: loads.length, data: loads })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/loads/:id
const getLoad = async (req, res) => {
  try {
    const load = await Load.findById(req.params.id).populate('driver', 'name email phone').populate('requestedBy', 'name email')
    if (!load) return res.status(404).json({ success: false, message: 'Load not found' })
    res.json({ success: true, data: load })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/loads
const createLoad = async (req, res) => {
  try {
    const load = await Load.create({ ...req.body, requestedBy: req.user._id })
    res.status(201).json({ success: true, data: load })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

// PUT /api/loads/:id
const updateLoad = async (req, res) => {
  try {
    const load = await Load.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!load) return res.status(404).json({ success: false, message: 'Load not found' })
    res.json({ success: true, data: load })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

// PUT /api/loads/:id/assign
const assignDriver = async (req, res) => {
  try {
    const { driverId } = req.body
    const load = await Load.findByIdAndUpdate(req.params.id, { driver: driverId, status: 'Assigned' }, { new: true }).populate('driver', 'name email')
    if (!load) return res.status(404).json({ success: false, message: 'Load not found' })
    res.json({ success: true, data: load })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

// DELETE /api/loads/:id
const deleteLoad = async (req, res) => {
  try {
    const load = await Load.findByIdAndDelete(req.params.id)
    if (!load) return res.status(404).json({ success: false, message: 'Load not found' })
    res.json({ success: true, message: 'Load removed' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getLoads, getLoad, createLoad, updateLoad, assignDriver, deleteLoad }
