/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-17.
 */

import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';

import {InstalledPlugin} from './types';

export * from './types';

const {UNAUTHORIZED} = LkErrorKey;

export class PluginAPI extends Request {
  /**
   * Get the list of installed plugins.
   */
  public getPlugins() {
    return this.handle(UNAUTHORIZED).request<InstalledPlugin[]>({
      url: '/admin/plugins',
      method: 'GET'
    });
  }

  /**
   * Restart all plugins.
   */
  public restartAll() {
    return this.handle(UNAUTHORIZED).request({
      url: '/admin/plugins/restart-all',
      method: 'POST'
    });
  }
}
