import { Logger } from 'winston';
import { IEmailLocals, winstonLogger } from '@ruldane/jobber-shared';
import { config } from '@notifications/config';
import { emailTemplates } from '@notifications/helpers';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'mailTransport', 'debug');

const sendEmail = async (template: string, receiverEmail: string, locals: IEmailLocals): Promise<void> => {
  try {
    // email template
    emailTemplates(template, receiverEmail, locals);
    log.info(`Email sent to ${receiverEmail}  successfully`);
  } catch (error) {
    log.log('error', 'Notification service mailTransport sendMail() method', error);
  }
};

export { sendEmail };
