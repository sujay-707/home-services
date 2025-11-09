const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// CREATE booking
router.post('/', async (req, res) => {
  try {
    const { serviceId, customerId, customerName, date, address, contact, notes } = req.body;

    if (!serviceId || !customerName || !date || !address || !contact) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newBooking = new Booking({
      serviceId,
      customerId: customerId || null,
      customerName,
      date,
      address,
      contact,
      notes
    });

    const saved = await newBooking.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Bad request' });
  }
});

// READ all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('serviceId').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// READ my bookings (customer)
router.get('/my/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const myBookings = await Booking.find({ customerId }).populate('serviceId').sort({ createdAt: -1 });
    res.json(myBookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// READ single booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('serviceId');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE booking
router.put('/:id', async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Booking not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Bad request' });
  }
});


// ✅ Get bookings by specific user
router.get('/user/:username', async (req, res) => {
  try {
    const bookings = await Booking.find({ customerName: req.params.username })
      .populate('serviceId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE booking
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Booking not found' });
    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
