const express = require('express');
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  getBookingsByStatus,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { protect, allowRoles } = require('../middleware/authMiddleware');
router.post('/', protect, allowRoles('company'), createBooking);
router.get('/', protect, allowRoles('company', 'vendor'), getAllBookings);
router.get('/status/:status', protect, allowRoles('company', 'vendor'), getBookingsByStatus);
router.put('/:id/status', protect, allowRoles('vendor'), updateBookingStatus);

module.exports = router;
