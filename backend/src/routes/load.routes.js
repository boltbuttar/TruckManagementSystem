const router = require('express').Router()
const {
  getAllLoads,
  getLoadById,
  createLoad,
  updateLoad,
  deleteLoad,
  assignDriver,
  updateLoadStatus,
  getDriverLoads
} = require('../controllers/index')
const { protect } = require('../middleware/auth')
const { roleCheck } = require('../middleware/roleCheck')

// Get all loads
router.get('/', getAllLoads)

// Get driver's loads
router.get('/driver/:driverId', getDriverLoads)

// Get single load
router.get('/:id', getLoadById)

// Create load
router.post('/', protect, createLoad)

// Update load (admin only)
router.put('/:id', protect, roleCheck('admin'), updateLoad)

// Delete load (admin only)
router.delete('/:id', protect, roleCheck('admin'), deleteLoad)

// Assign driver to load (admin only)
router.post('/:id/assign', protect, roleCheck('admin'), assignDriver)

// Update load status (admin only)
router.patch('/:id/status', protect, roleCheck('admin'), updateLoadStatus)

module.exports = router
