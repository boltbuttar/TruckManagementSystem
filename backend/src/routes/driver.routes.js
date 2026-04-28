const router = require('express').Router()
const {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
  getAvailableDrivers,
  updateAvailability
} = require('../controllers/index')
const { protect } = require('../middleware/auth')
const { roleCheck } = require('../middleware/roleCheck')

// Get available drivers
router.get('/available', getAvailableDrivers)

// Get all drivers
router.get('/', getAllDrivers)

// Get single driver
router.get('/:id', getDriverById)

// Create driver (admin only)
router.post('/', protect, roleCheck('admin'), createDriver)

// Update driver (admin only)
router.put('/:id', protect, roleCheck('admin'), updateDriver)

// Delete driver (admin only)
router.delete('/:id', protect, roleCheck('admin'), deleteDriver)

// Update availability (admin only)
router.patch('/:id/availability', protect, roleCheck('admin'), updateAvailability)

module.exports = router
