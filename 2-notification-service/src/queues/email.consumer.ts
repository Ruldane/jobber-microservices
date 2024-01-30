// Import necessary modules and libraries
import { Channel, ConsumeMessage } from 'amqplib';
import { Logger } from 'winston';
import { config } from '@notifications/config';
import { IEmailLocals, winstonLogger } from '@ruldane/jobber-shared';
import { createConnection } from '@notifications/queues/connection';
import { sendEmail } from '@notifications/queues/mail.transport';
// Create a logger instance
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'emailConsumer', 'debug');

// Define an asynchronous function named consumeAuthEmailMessages that takes a channel as a parameter and returns a Promise with no value (void)
const consumeAuthEmailMessages = async (channel: Channel | undefined): Promise<void> => {
  try {
    // Check if the channel is defined
    if (!channel) {
      // If the channel is not defined, create a new connection and assign the channel to it
      channel = (await createConnection()) as Channel;
    }
    // Define the name of the exchange, routing key, and queue for the email notifications
    const exchangeName = 'jobber-email-notification';
    const routingKey = 'auth-email';
    const queueName = 'auth-email-queue';

    // Assert the existence of the exchange with the specified name and type 'direct'
    await channel.assertExchange(exchangeName, 'direct');

    // Assert the existence of the queue with the specified name, options, and bindings
    const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });

    // Bind the queue to the exchange using the specified routing key
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);

    // Consume messages from the queue
    channel.consume(jobberQueue.queue, async (message: ConsumeMessage | null) => {
      // Parse the content of the message as a JSON object and log it to the console
      const { receiverEmail, username, verifyLink, resetLink, template } = JSON.parse(message!.content.toString());
      const locals: IEmailLocals = {
        appLink: `${config.CLIENT_URL}`,
        appIcon: 'https://i.ibb.co/Kyp2m0t/cover.png',
        username,
        verifyLink,
        resetLink
      };
      await sendEmail(template, receiverEmail, locals);

      // TODO: Implement the logic to send an email based on the message content

      // Acknowledge the message to remove it from the queue
      channel?.ack(message!);
    });
  } catch (error) {
    // Log any errors that occur during the execution of the function
    log.log('error', 'Notification service EmailConsumer consumeAuthEmailMessages() method', error);
  }
};

async function consumeOtherEmailMessages(channel: Channel): Promise<void> {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = 'jobber-order-notification';
    const routingKey = 'order-email';
    const queueName = 'order-email-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      const {
        receiverEmail,
        username,
        template,
        sender,
        offerLink,
        amount,
        buyerUsername,
        sellerUsername,
        title,
        description,
        deliveryDays,
        orderId,
        orderDue,
        requirements,
        orderUrl,
        originalDate,
        newDate,
        reason,
        subject,
        header,
        type,
        message,
        serviceFee,
        total
      } = JSON.parse(msg!.content.toString());
      const locals: IEmailLocals = {
        appLink: `${config.CLIENT_URL}`,
        appIcon: 'https://i.ibb.co/Kyp2m0t/cover.png',
        username,
        sender,
        offerLink,
        amount,
        buyerUsername,
        sellerUsername,
        title,
        description,
        deliveryDays,
        orderId,
        orderDue,
        requirements,
        orderUrl,
        originalDate,
        newDate,
        reason,
        subject,
        header,
        type,
        message,
        serviceFee,
        total
      };
      if (template === 'orderPlaced') {
        await sendEmail('orderPlaced', receiverEmail, locals);
        await sendEmail('orderReceipt', receiverEmail, locals);
      } else {
        await sendEmail(template, receiverEmail, locals);
      }
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'NotificationService EmailConsumer consumeOrderEmailMessages() method error:', error);
  }
}

export { consumeAuthEmailMessages, consumeOtherEmailMessages };
