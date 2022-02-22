import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';

const {UNAUTHORIZED, FORBIDDEN, CRITICAL} = LkErrorKey;

export class MailerAPI extends Request {
  /**
   * Test the mailer SMTP config
   */
  public checkEmailConfiguration() {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, CRITICAL],
      url: '/admin/notifications/email/checkEmailConfiguration',
      method: 'POST'
    });
  }
}
