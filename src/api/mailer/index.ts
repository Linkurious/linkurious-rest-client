import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';

const {UNAUTHORIZED, FORBIDDEN, SEND_MAIL_FAILED} = LkErrorKey;

export class MailerAPI extends Request {
  /**
   * Test the mailer SMTP config
   */
  public checkEmailConfiguration() {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, SEND_MAIL_FAILED],
      url: '/admin/notifications/email/checkEmailConfiguration',
      method: 'POST'
    });
  }
}
