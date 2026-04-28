const Dispatch = require('../models/Dispatch')
const Load     = require('../models/Load')

const PIPELINE = [
  'Order Placed', 'Driver Assigned', 'Pickup Confirmed',
  'In Transit', 'Out for Delivery', 'Delivered'
]

// GET /api/dispatch  – list all dispatch records
const getDispatches = async (req, res) => {
  try {
    const dispatches = await Dispatch.find()
      .populate('load',   'loadId pickup delivery cargoType status')
      .populate('driver', 'name email phone')
      .sort({ updatedAt: -1 })
    res.json({ success: true, count: dispatches.length, data: dispatches })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/dispatch/:id
const getDispatch = async (req, res) => {
  try {
    const dispatch = await Dispatch.findById(req.params.id)
      .populate('load')
      .populate('driver', 'name email phone')
    if (!dispatch) return res.status(404).json({ success: false, message: 'Dispatch record not found' })
    res.json({ success: true, data: dispatch })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// PUT /api/dispatch/:id/status  – advance or set dispatch step
const updateDispatchStatus = async (req, res) => {
  try {
    const { step, note } = req.body
    const dispatch = await Dispatch.findById(req.params.id)
    if (!dispatch) return res.status(404).json({ success: false, message: 'Dispatch record not found' })

    const newStep = typeof step === 'number' ? step : dispatch.currentStep + 1
    if (newStep > 5) return res.status(400).json({ success: false, message: 'Already at final step' })

    dispatch.timeline.push({ step: newStep, label: PIPELINE[newStep], note })
    dispatch.currentStep = newStep
    await dispatch.save()

    // Mirror status on Load document
    const loadStatus = newStep === 5 ? 'Delivered' : newStep >= 3 ? 'In Transit' : 'Assigned'
    await Load.findByIdAndUpdate(dispatch.load, { status: loadStatus, dispatchStep: newStep })

    res.json({ success: true, data: dispatch })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

// POST /api/dispatch  – create dispatch record for a load
const createDispatch = async (req, res) => {
  try {
    const { loadId, driverId, estimatedDelivery } = req.body
    const dispatch = await Dispatch.create({
      load: loadId,
      driver: driverId,
      estimatedDelivery,
      timeline: [{ step: 0, label: PIPELINE[0] }],
      currentStep: 0,
    })
    await Load.findByIdAndUpdate(loadId, { status: 'Assigned', driver: driverId, dispatchStep: 0 })
    res.status(201).json({ success: true, data: dispatch })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

module.exports = { getDispatches, getDispatch, createDispatch, updateDispatchStatus }
