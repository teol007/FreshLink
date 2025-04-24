import amqp from 'amqplib';
import { orderProductsMsQueueBaseUrl, orderProductsMsQueueName } from '../../config';

let channel: amqp.Channel;
const queueName = orderProductsMsQueueName || "orders"

export const connectOrderProductsServiceMQ = async () => {
  const connection = await amqp.connect('amqp://'+orderProductsMsQueueBaseUrl);
  channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: false });
};

export const publishToQueueOrderProductsService = (message: object) => {
  if (!channel) throw new Error('RabbitMQ channel is not initialized.');
  const buffer = Buffer.from(JSON.stringify(message));
  channel.sendToQueue(queueName, buffer, { persistent: true });
};
