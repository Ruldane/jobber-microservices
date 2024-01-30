import { Client } from '@elastic/elasticsearch';
import { Logger } from 'winston';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { winstonLogger } from '@ruldane/jobber-shared';
import { config } from '@notifications/config';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notification-eleastic-search-server', 'debug');

const elasticSearchClient: Client = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`
});

export const checkConnection = async (): Promise<void> => {
  let isConnected = false;
  while (!isConnected) {
    try {
      const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
      log.info(`Elastic search health status ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('Error connecting to elastic search');
      log.log('error', 'NotificationService checkConnection() method', error);
    }
  }
};
