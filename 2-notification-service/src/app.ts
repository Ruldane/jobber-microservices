import { winstonLogger } from '@ruldane/jobber-shared';
import { Logger } from 'winston';
import { config } from '@notifications/config';
import express, { Express } from 'express';
import { start } from '@notifications/server';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notification-app-server', 'debug');

const intialize = async (): Promise<void> => {
  const app: Express = express();
  start(app);
  log.info('Worker app.ts server with process id of %d started on notification has started', process.pid);
};

intialize();
