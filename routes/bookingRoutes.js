const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/', bookingController.createBooking);
router.get('/', bookingController.getAllBookings);
router.get('/status/:status', bookingController.getBookingsByStatus);
router.put('/:id/status', bookingController.updateBookingStatus);

module.exports = router;
