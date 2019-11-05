/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

import {LkErrorKey, Response} from '../../http/response';
import {Request} from '../../http/request';

import {
  IGetConfigParams,
  GetConfigResponse,
  IGetCustomFilesParams,
  GetCustomFilesResponse,
  IGetReportParams,
  GetStatusResponse,
  GetVersionResponse,
  RestartLinkuriousResponse,
  ISendAnalyticsParams,
  IUpdateConfigParams
} from './types';

export * from './types';

const {UNAUTHORIZED, FORBIDDEN} = LkErrorKey;

export class LinkuriousAPI extends Request {
  public getStatus() {
    return this.request<GetStatusResponse>({
      url: '/status',
      method: 'GET'
    });
  }

  public getVersion() {
    return this.request<GetVersionResponse>({
      url: '/version',
      method: 'GET'
    });
  }

  public getConfiguration(params?: IGetConfigParams) {
    return this.handle().request<GetConfigResponse>({
      url: '/config',
      method: 'GET',
      params: params
    });
  }

  public updateConfiguration(params: IUpdateConfigParams<any>) {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request({
      url: '/config',
      method: 'POST',
      params: params
    });
  }

  public sendAnalytics(params: ISendAnalyticsParams) {
    return this.handle().request({
      url: '/analytics',
      method: 'POST',
      params: params
    });
  }

  public getReport(params?: IGetReportParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request({
      url: '/admin/report',
      method: 'GET',
      params: params
    });
  }

  public getCustomFiles(params?: IGetCustomFilesParams) {
    return this.request<GetCustomFilesResponse>({
      url: '/customFiles',
      method: 'GET',
      params: params
    });
  }

  public async restartLinkurious() {
    const response = await this.handle(UNAUTHORIZED, FORBIDDEN).request<RestartLinkuriousResponse>({
      url: '/admin/restart',
      method: 'POST'
    });
    if (response.isAnyError()) {
      return response;
    } else {
      return new Response({
        body: response.body.url,
        status: response.status,
        header: response.header
      });
    }
  }
}
