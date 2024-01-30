import * as connection from '@notifications/queues/connection';
import amqp from 'amqplib';
// import { Channel } from 'amqplib';
import { consumeAuthEmailMessages, consumeOtherEmailMessages } from '@notifications/queues/email.consumer';

jest.mock('@notifications/queues/connection');
jest.mock('amqplib');
jest.mock('@ruldane/jobber-shared');

describe('Email Consumer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('consumeAuthEmailMessages', () => {
    it('should assert the queue', async () => {
      const Channel = {
        assertExchange: jest.fn(),
        publish: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn()
      };
      jest.spyOn(Channel, 'assertExchange');
      jest.spyOn(Channel, 'assertQueue').mockReturnValue({ queue: 'auth-email-queue', messageCount: 0, consumerCount: 0 });
      jest.spyOn(connection, 'createConnection').mockReturnValue(Channel as never);
      const connectionChannel: amqp.Channel | undefined = await connection.createConnection();
      await consumeAuthEmailMessages(connectionChannel!);
      expect(connectionChannel!.assertExchange).toHaveBeenCalledWith('jobber-email-notification', 'direct');
      expect(connectionChannel!.assertQueue).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.bindQueue).toHaveBeenCalledWith('auth-email-queue', 'jobber-email-notification', 'auth-email');
    });
  });

  describe('consumeOtherEmailMessages', () => {
    it('should assert the queue', async () => {
      const Channel = {
        assertExchange: jest.fn(),
        publish: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn()
      };
      jest.spyOn(Channel, 'assertExchange');
      jest.spyOn(Channel, 'assertQueue').mockReturnValue({ queue: 'order-email-queue', messageCount: 0, consumerCount: 0 });
      jest.spyOn(connection, 'createConnection').mockReturnValue(Channel as never);
      const connectionChannel: amqp.Channel | undefined = await connection.createConnection();
      await consumeOtherEmailMessages(connectionChannel!);
      expect(connectionChannel!.assertExchange).toHaveBeenCalledWith('jobber-order-notification', 'direct');
      expect(connectionChannel!.assertQueue).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.bindQueue).toHaveBeenCalledWith('order-email-queue', 'jobber-order-notification', 'order-email');
    });
  });
});
