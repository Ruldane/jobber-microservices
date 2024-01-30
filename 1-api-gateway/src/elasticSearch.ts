import { winstonLogger } from '@ruldane/jobber-shared';
import { Logger } from 'winston';
import { config } from '@gateway/config';
import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'apiGatewayElasticConnection', 'debug');

class ElasticSearch {
  private elasticSearch: Client;

  constructor() {
    this.elasticSearch = new Client({
      node: config.ELASTIC_SEARCH_URL
    });
  }

  public async checkConnection(): Promise<void> {
    let isConnected = false;
    while (!isConnected) {
      try {
        log.info('Gateway Service connecting to ElasticSearch...');
        const health: ClusterHealthResponse = await this.elasticSearch.cluster.health({});
        log.info(`Gateway service ElasticService Health status - ${health.status}`);
        isConnected = true;
        isConnected = true;
      } catch (error) {
        log.error('Connection to Elastic Search failed, retrying...', error);
        log.log('error', 'GatewayService checkConnection() method Error: ', error);
      }
    }
  }
}

export const elasticSearch: ElasticSearch = new ElasticSearch();
