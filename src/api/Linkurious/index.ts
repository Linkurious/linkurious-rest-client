/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

import {LkErrorKey} from '../../http/response';
import {Request} from '../../http/request';

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
  public getStatus() {
    return this.request<ServerStatus>({
      url: '/status',
      method: 'GET'
    });
  }

  /**
   * Get Linkurious' current version information.
   */
  public getVersion() {
    return this.request<ServerVersion>({
      url: '/version',
      method: 'GET'
    });
  }

  /**
   * Save an event to the analytics' log file. All events follow the Segment Spec.
   */
  public sendAnalytics(params: ISendAnalyticsParams) {
    return this.request({
      url: '/analytics',
      method: 'POST',
      params: params
    });
  }

  /**
   * Collect all the analytics and log files in a compressed tarball and return it.
   */
  public getReport(params?: IGetReportParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request({
      url: '/admin/report',
      method: 'GET',
      params: params
    });
  }

  /**
   * Restart Linkurious. Return the URL of Linkurious after the restart.
   */
  public restartLinkurious() {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request<RestartLinkuriousResponse>({
      url: '/admin/restart',
      method: 'POST'
    });
  }

  /**
   * List all custom files in the specified root directory.
   */
  public getCustomFiles(params?: IGetCustomFilesParams) {
    return this.handle(UNAUTHORIZED).request<CustomFile[]>({
      url: '/customFiles',
      method: 'GET',
      params: params
    });
  }
}
