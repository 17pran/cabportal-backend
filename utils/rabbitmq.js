// utils/rabbitmq.js
const amqp = require('amqplib');
let channel = null;
require('dotenv').config();

async function connectRabbitMQ() {
  try {
    const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log('✅ Connected to RabbitMQ');
  } catch (err) {
    console.error('❌ RabbitMQ connection error:', err);
  }
}

async function publishToQueue(queueName, data) {
  if (!channel) {
    console.error('❌ Cannot publish, no RabbitMQ channel established');
    return;
  }

  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
}

module.exports = {
  connectRabbitMQ,
  publishToQueue
};
