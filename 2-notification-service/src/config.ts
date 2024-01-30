import dotenv from 'dotenv';

dotenv.config({});

class Config {
  NODE_ENV: string | undefined;
  CLIENT_URL: string | undefined;
  RABBITMQ_ENPOINT: string | undefined;
  SENDER_EMAIL: string | undefined;
  SENDER_EMAIL_PASSWORD: string | undefined;
  ELASTIC_SEARCH_URL: string | undefined;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.RABBITMQ_ENPOINT = process.env.RABBITMQ_ENPOINT || '';
    this.SENDER_EMAIL = process.env.SENDER_EMAIL || '';
    this.SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD || '';
    this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
  }
}

export const config: Config = new Config();
