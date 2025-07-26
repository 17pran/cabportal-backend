// utils/vendorConsumer.js
const amqp = require('amqplib');

const QUEUE = 'booking_requests';

async function startVendorConsumer() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE, { durable: true });

    console.log(`Vendor listening on queue: ${QUEUE}`);

    channel.consume(QUEUE, (msg) => {
      if (msg !== null) {
        const booking = JSON.parse(msg.content.toString());
        console.log('Received booking:', booking);

        channel.ack(msg); 
      }
    });
  } catch (err) {
    console.error('Vendor consumer error:', err.message);
  }
}

module.exports = { startVendorConsumer };
