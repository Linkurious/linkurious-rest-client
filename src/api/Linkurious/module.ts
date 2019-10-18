/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

// TS2019-DONE

import {
  Forbidden, InvalidParameter, LkErrorKey, LkResponse, Responses, Success, Unauthorized,
  BadGraphRequest, from
} from '../response';
import {Module, RawFetchConfig} from '../Module';

import {
  IGetConfigParams, IGetConfigResponse,
  IGetCustomFilesParams,
  IGetCustomFilesResponse,
  IGetReportParams,
  IGetStatusResponse,
  IGetVersionResponse,
  IRestartLinkuriousResponse,
  ISendAnalyticsParams,
  IUpdateConfigParams
} from './types';

export class LinkuriousModule extends Module {
  async getStatus() {
    const response: Responses<IGetStatusResponse> = await this.request({
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

  async getVersion(): Promise<Responses<IGetVersionResponse>> {
    return this.request({
      url: '/version',
      method: 'GET'
    });
  }

  async getConfiguration(params?: IGetConfigParams){
    const errors = from([LkErrorKey.INVALID_PARAMETER, LkErrorKey.BAD_GRAPH_REQUEST]);
    return this.request<IGetConfigResponse, typeof errors[0]>({
      errors,
      url: '/config',
      method: 'GET',
      params: params
    });
  }

  async updateConfiguration(
    params: IUpdateConfigParams<any>
  ): Promise<Responses<void | Unauthorized | Forbidden>> {
    return this.request({
      url: '/config',
      method: 'POST',
      params: params
    });
  }

  async sendAnalytics(
    params: ISendAnalyticsParams
  ): Promise<Responses<void | InvalidParameter>> {
    return this.request({
      url: '/analytics',
      method: 'POST',
      params: params
    });
  }

  async getReport(
    params?: IGetReportParams
  ): Promise<Responses<void | Unauthorized | Forbidden>> {
    return this.request({
      url: '/admin/report',
      method: 'GET',
      params: params
    });
  }

  async getCustomFiles(
    params?: IGetCustomFilesParams
  ): Promise<Responses<IGetCustomFilesResponse>> {
    return this.request({
      url: '/customFiles',
      method: 'GET',
      params: params
    });
  }

  async restartLinkurious() {
    const response: Responses<IRestartLinkuriousResponse | Unauthorized | Forbidden> = await this.request({
      url: '/admin/restart',
      method: 'POST'
    });
    if (response.isSuccess()) {
      return new LkResponse({
        body: response.body.url,
        status: response.status,
        header: response.header
      });
    } else {
      return response
    }
  }
}

