import http from 'http';

import { Channel } from 'amqplib';
import { config } from '@notifications/config';
import 'express-async-errors';
import { Application } from 'express';
import { Logger } from 'winston';
import { IEmailMessageDetails, winstonLogger } from '@ruldane/jobber-shared';
import { healthRoutes } from '@notifications/routes';
import { checkConnection } from '@notifications/elasticsearch';
import { createConnection } from '@notifications/queues/connection';
import { consumeAuthEmailMessages, consumeOtherEmailMessages } from '@notifications/queues/email.consumer';

const SERVER_PORT = 4001;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notifications-service', 'debug');

export function start(app: Application): void {
  startServer(app);
  app.use('', healthRoutes());
  startQueue();
  startElasticSearch();
}

const startQueue = async (): Promise<void> => {
  const emailChannel: Channel = (await createConnection()) as Channel;
  await consumeAuthEmailMessages(emailChannel);
  await consumeOtherEmailMessages(emailChannel);

  const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=fdffd1fd556`;
  const messageDetails: IEmailMessageDetails = {
    receiverEmail: `${config.SENDER_EMAIL}`,
    verifyLink: verificationLink,
    template: 'verifyEmail'
  };

  await emailChannel.assertExchange('jobber-email-notification', 'direct');
  await emailChannel.assertExchange('jobber-order-notification', 'direct');

  const messageEmail = JSON.stringify(messageDetails);
  emailChannel.publish('jobber-email-notification', 'auth-email', Buffer.from(messageEmail));

  // const messageOrderEmail = JSON.stringify({ name: 'jobber-email-oder', service: 'order notification' });
  // emailChannel.publish('jobber-order-notification', 'order-email', Buffer.from(messageOrderEmail));
};

const startElasticSearch = (): void => {
  checkConnection();
};

const startServer = (app: Application): void => {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info('Worker with process id of %d started on notification server has started', process.pid);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification server started on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'Error starting server  startServer() method', error);
  }
};
