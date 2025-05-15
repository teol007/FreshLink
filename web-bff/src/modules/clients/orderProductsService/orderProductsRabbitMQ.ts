import amqp from 'amqplib';
import { auditLogsMsQueueName, orderProductsMsQueueBaseUrl, orderProductsMsQueueName } from '../../config';

let channel: amqp.Channel;
const queueName = orderProductsMsQueueName || "orders"
const logsQueueName = auditLogsMsQueueName || "audit_logs"

export const connectOrderProductsServiceMQ = async () => {
  const connection = await amqp.connect('amqp://'+orderProductsMsQueueBaseUrl);
  channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: false });
  await channel.assertQueue(logsQueueName, { durable: true });
};

export const publishToQueueOrderProductsService = (message: object) => {
  if (!channel) throw new Error('RabbitMQ channel is not initialized.');
  const buffer = Buffer.from(JSON.stringify(message));
  channel.sendToQueue(queueName, buffer, { persistent: true });
};

export const publishToQueueAuditLogs = (text: string) => {
  console.log(text);
  if (!channel) throw new Error('RabbitMQ channel is not initialized.');
  const buffer = Buffer.from(JSON.stringify({service: "web-bff", message: text}));
  channel.sendToQueue(logsQueueName, buffer, { persistent: true });
};
