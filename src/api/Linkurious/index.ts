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

const {FORBIDDEN, UNAUTHORIZED} = LkErrorKey;

export class LinkuriousAPI extends Request {
  async getStatus() {
    const response = await this.request<GetStatusResponse>({
      url: '/status',
      method: 'GET'
    });
    if (response.isSuccess()) {
      return new Response({
        body: response.body.status,
        status: response.status,
        header: response.header
      });
    } else {
      return response;
    }
  }

  async getVersion() {
    return this.request<GetVersionResponse>({
      url: '/version',
      method: 'GET'
    });
  }

  async getConfiguration(params?: IGetConfigParams) {
    return this.handle().request<GetConfigResponse>({
      url: '/config',
      method: 'GET',
      params: params
    });
  }

  async updateConfiguration(params: IUpdateConfigParams<any>) {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request({
      url: '/config',
      method: 'POST',
      params: params
    });
  }

  async sendAnalytics(params: ISendAnalyticsParams) {
    return this.handle().request({
      url: '/analytics',
      method: 'POST',
      params: params
    });
  }

  async getReport(params?: IGetReportParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request({
      url: '/admin/report',
      method: 'GET',
      params: params
    });
  }

  async getCustomFiles(params?: IGetCustomFilesParams) {
    return this.request<GetCustomFilesResponse>({
      url: '/customFiles',
      method: 'GET',
      params: params
    });
  }

  async restartLinkurious() {
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
