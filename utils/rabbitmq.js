// utils/rabbitmq.js
const amqp = require('amqplib');
require('dotenv').config();

let channel = null;

async function connectRabbitMQ() {
  try {
    const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
    const connection = await amqp.connect(rabbitmqUrl);
    channel = await connection.createChannel();
    console.log('✅ Connected to RabbitMQ');
  } catch (err) {
    console.error('❌ RabbitMQ connection error:', err.message);
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
