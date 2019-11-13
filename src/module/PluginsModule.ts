/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-17.
 */

// TS2019-DONE

import {GetPluginsResponse} from '../models/Plugins';
import {Unauthorized} from '../response/errors';
import {Success} from '../response/success';

import {Module} from './Module';

export class PluginsModule extends Module {
  /**
   * Get the list of installed plugins.
   */
  public getPlugins(): Promise<Success<GetPluginsResponse> | Unauthorized> {
    return this.request({
      url: '/admin/plugins',
      method: 'GET'
    });
  }

  /**
   * Restart all plugins.
   */
  public restartAll(): Promise<Success<void> | Unauthorized> {
    return this.request({
      url: '/admin/plugins/restart-all',
      method: 'POST'
    });
  }
}
