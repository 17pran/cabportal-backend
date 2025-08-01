const Booking = require('../models/Booking');
const { publishToQueue } = require('../utils/rabbitmq');

exports.createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    const saved = await booking.save();

    await publishToQueue('booking_requests', {
      bookingId: saved._id,
      guestName: saved.guestName,
      email: saved.email,
      pickup: saved.pickup,
      dropoff: saved.dropoff,
      datetime: saved.datetime,
      tripType: saved.tripType,
      vendor: saved.vendor,
    });

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create booking', details: err.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

exports.getBookingsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const bookings = await Booking.find({ status }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings by status' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Booking.findByIdAndUpdate(id, { status }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update booking status' });
  }
};
