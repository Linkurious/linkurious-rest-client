/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

// TS2019-DONE

import {LkErrorKey, LkResponse} from '../response';
import {Module} from '../Module';

import {
  IGetConfigParams,
  IGetConfigResponse,
  IGetCustomFilesParams,
  IGetCustomFilesResponse,
  IGetReportParams,
  IGetStatusResponse,
  IGetVersionResponse,
  IRestartLinkuriousResponse,
  ISendAnalyticsParams,
  IUpdateConfigParams
} from './types';

const {INVALID_PARAMETER, FORBIDDEN, UNAUTHORIZED} = LkErrorKey;

export class LinkuriousModule extends Module {
  async getStatus() {
    const response = await this.request<IGetStatusResponse>({
      url: '/status',
      method: 'GET'
    });
    if (response.isSuccess()) {
      return new LkResponse({
        body: response.body.status,
        status: response.status,
        header: response.header
      });
    } else {
      return response;
    }
  }

  async getVersion() {
    return this.request<IGetVersionResponse>({
      url: '/version',
      method: 'GET'
    });
  }

  async getConfiguration(params?: IGetConfigParams) {
    return this.handle(INVALID_PARAMETER).request<IGetConfigResponse>({
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
    return this.handle(INVALID_PARAMETER).request({
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
    return this.request<IGetCustomFilesResponse>({
      url: '/customFiles',
      method: 'GET',
      params: params
    });
  }

  async restartLinkurious() {
    const response = await this.handle(UNAUTHORIZED, FORBIDDEN).request<IRestartLinkuriousResponse>(
      {url: '/admin/restart', method: 'POST'}
    );
    if (response.isSuccess()) {
      return new LkResponse({
        body: response.body.url,
        status: response.status,
        header: response.header
      });
    } else {
      return response;
    }
  }
}
