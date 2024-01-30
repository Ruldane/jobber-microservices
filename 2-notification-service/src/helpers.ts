// Import necessary modules and libraries
import path from 'path';

import { Logger } from 'winston';
import { config } from '@notifications/config';
import { IEmailLocals, winstonLogger } from '@ruldane/jobber-shared';
import nodeMailer, { Transporter } from 'nodemailer';
import Email from 'email-templates';

// Create a logger instance
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'mailTransportHelper', 'debug');

const emailTemplates = async (template: string, receiverEmail: string, locals: IEmailLocals): Promise<void> => {
  try {
    const smtpTransport: Transporter = nodeMailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: config.SENDER_EMAIL,
        pass: config.SENDER_EMAIL_PASSWORD
      }
    });
    const email: Email = new Email({
      message: {
        from: `Jobber App <${config.SENDER_EMAIL}>`
      },
      send: true,
      preview: false,
      transport: smtpTransport,
      views: {
        options: {
          extension: 'ejs'
        }
      },
      // Juice is to be able to use inline styles in the email templates
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, '../build')
        }
      }
    });

    await email.send({
      template: path.join(__dirname, '..', 'src/emails', template),
      message: { to: receiverEmail },
      locals
    });
  } catch (error) {
    log.error('error', 'Notification service mailTransportHelper emailTemplate() method', error);
  }
};

export { emailTemplates };
