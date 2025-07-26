const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  guestName: { type: String, required: true },
  passengers: { type: Number, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String },
  tripType: { type: String, enum: ['Local', 'Outstation'], required: true },
  pickup: { type: String, required: true },
  dropoff: { type: String, required: true },
  datetime: { type: Date, required: true },
  vehicle: { type: String, required: true },
  vendor: { type: String, required: true },
  status: { type: String, default: 'Upcoming' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
