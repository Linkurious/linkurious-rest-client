import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';

const {UNAUTHORIZED, FORBIDDEN, CRITICAL} = LkErrorKey;

export class TestMailerConfigAPI extends Request {
  /**
   * Test the mailer SMTP config
   */
  public testMailerConfig() {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, CRITICAL],
      url: '/notifications/email/test',
      method: 'POST'
    });
  }
}
