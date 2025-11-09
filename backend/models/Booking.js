// backend/models/Booking.js
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: { type: String, required: true },
  date: { type: String, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  notes: { type: String },
  paid: { type: Boolean, default: false }, // <-- added
  payment: { // optional payment metadata
    method: { type: String },
    amount: { type: Number },
    txnId: { type: String },
    paidAt: { type: Date }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
