
// backend/utils/vendorConsumer.js
import amqp from 'amqplib';
import Booking from '../models/bookingModel.js';

export const consumeVendorQueue = async () => {
  try {
    const conn = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await conn.createChannel();

    const queue = 'vendorQueue';
    await channel.assertQueue(queue, { durable: false });

    console.log(`✅ Waiting for messages in ${queue}...`);

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const bookingData = JSON.parse(msg.content.toString());

        console.log('📩 Received booking for vendor:', bookingData);

        // Save booking to DB
        const newBooking = new Booking(bookingData);
        await newBooking.save();

        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('❌ Error in vendorConsumer:', error);
  }
};
