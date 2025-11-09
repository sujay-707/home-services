require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Import Routes
const servicesRoutes = require('./routes/services');
const bookingsRoutes = require('./routes/bookings');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Mongoose config
mongoose.set('strictQuery', true);

// Connect DB
connectDB(process.env.MONGO_URI);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/services', servicesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/auth', authRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('🏠 Home Services API running successfully');
});

// Start
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
