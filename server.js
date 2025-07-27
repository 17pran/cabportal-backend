const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const { connectRabbitMQ } = require('./utils/rabbitmq');
const { consumeVendorQueue } = require('./utils/vendorConsumer');

dotenv.config();

const app = express(); // ✅ Define app before using it

// Logging middleware
app.use((req, res, next) => {
  console.log(`📥 Incoming ${req.method} request to ${req.url}`);
  next();
});

const allowedOrigins = ['https://cabportal-frontend.vercel.app'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ MongoDB connected');

  await connectRabbitMQ();
  consumeVendorQueue();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB error:', err);
});
