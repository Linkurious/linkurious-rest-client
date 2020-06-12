/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-17.
 */

import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';

import {InstalledPlugin} from './types';

export * from './types';

const {UNAUTHORIZED, FORBIDDEN} = LkErrorKey;

export class PluginAPI extends Request {
  /**
   * Get the list of installed plugins.
   */
  public getPlugins(this: Request<InstalledPlugin[]>) {
    return this.request({errors: [UNAUTHORIZED, FORBIDDEN], url: '/admin/plugins', method: 'GET'});
  }

  /**
   * Restart all plugins.
   */
  public restartAll() {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN],
      url: '/admin/plugins/restart-all',
      method: 'POST'
    });
  }
}
