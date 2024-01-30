// Import necessary modules and libraries
import 'express-async-errors';
import { Logger } from 'winston';
import { winstonLogger } from '@ruldane/jobber-shared';
import { config } from '@notifications/config';
import client, { Channel, Connection } from 'amqplib';

// Create a logger instance
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notification-queue-Connection', 'debug');

// Function to create a connection to RabbitMQ and return a channel
const createConnection = async (): Promise<Channel | undefined> => {
  try {
    // Connect to RabbitMQ server
    const connection: Connection = await client.connect(`${config.RABBITMQ_ENPOINT}`);

    // Create a channel
    const channel: Channel = await connection.createChannel();

    // Log successful connection
    log.info('Notification service connected to RabbitMQ created successfully');

    // Close the connection when the process receives a SIGINT signal
    closeConnection(channel, connection);

    // Return the channel
    return channel;
  } catch (error) {
    // Log any errors that occur during connection creation
    log.log('error', 'Notification connection createConnection() method', error);

    // Return undefined if connection creation fails
    return undefined;
  }
};

// Function to close the channel and connection when the process receives a SIGINT signal
const closeConnection = async (channel: Channel, connection: Connection): Promise<void> => {
  process.on('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });
};

// Export the createConnection function
export { createConnection };
