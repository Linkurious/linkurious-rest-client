/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

import { LkErrorKey } from '../../http/response';
import { Request } from '../../http/request';

import {
  IGetCustomFilesParams,
  IGetReportParams,
  RestartLinkuriousResponse,
  ISendAnalyticsParams,
  ServerStatus,
  ServerVersion,
  CustomFile
} from './types';

export * from './types';

const {UNAUTHORIZED, FORBIDDEN} = LkErrorKey;

export class LinkuriousAPI extends Request {
  /**
   * Get the status of the Linkurious server.
   */
  public getStatus(this: Request<ServerStatus>) {
    return this.request({
      url: '/status',
      method: 'GET'
    });
  }

  /**
   * Get Linkurious current version information.
   */
  public getVersion(this: Request<ServerVersion>) {
    return this.request({
      url: '/version',
      method: 'GET'
    });
  }

  /**
   * Save an event to the analytics log file. All events follow the Segment Spec.
   */
  public sendAnalytics(params: ISendAnalyticsParams) {
    return this.request({
      errors: [UNAUTHORIZED],
      url: '/tm',
      method: 'POST',
      params: params
    });
  }

  /**
   * Collect all the analytics and log files in a compressed tarball and return it.
   */
  public getReport(params?: IGetReportParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN],
      url: '/admin/report',
      method: 'GET',
      params: params
    });
  }

  /**
   * Restart Linkurious. Return the URL of Linkurious after the restart.
   */
  public restartLinkurious(this: Request<RestartLinkuriousResponse>) {
    return this.request({errors: [UNAUTHORIZED, FORBIDDEN], url: '/admin/restart', method: 'POST'});
  }

  /**
   * List all custom files in the specified root directory.
   */
  public getCustomFiles(this: Request<CustomFile[]>, params?: IGetCustomFilesParams) {
    return this.request({
      errors: [UNAUTHORIZED],
      url: '/customFiles',
      method: 'GET',
      params: params
    });
  }
}
