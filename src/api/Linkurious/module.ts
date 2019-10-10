/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

// TS2019-DONE

import {
  Success,
  InvalidParameter,
  Forbidden,
  Unauthorized, LkGuards
} from '../response';
import {Module} from '../Module';

import {
  IGetStatusResponse,
  IGetVersionResponse,
  IGetConfigParams,
  IGetConfigResponse,
  IUpdateConfigParams,
  ISendAnalyticsParams,
  IGetReportParams,
  IGetCustomFilesParams,
  IGetCustomFilesResponse,
  IRestartLinkuriousResponse
} from './types';

export class LinkuriousModule extends Module {
  async getStatus(): Promise<Success<IGetStatusResponse['status']>> {
    const response: Success<IGetStatusResponse> = await this.request({
      url: '/status',
      method: 'GET'
    });
    if (LkGuards.isSuccess(response)) {
      return {
        ...response,
        response: response.response.status
      };
    }
    return response;
  }

  async getVersion(): Promise<Success<IGetVersionResponse>> {
    return this.request({
      url: '/version',
      method: 'GET'
    });
  }

  async getConfiguration(
    params?: IGetConfigParams
  ): Promise<Success<IGetConfigResponse> | InvalidParameter> {
    return this.request({
      url: '/config',
      method: 'GET',
      params: params
    });
  }

  async updateConfiguration(
    params: IUpdateConfigParams<any>
  ): Promise<Success<void> | Unauthorized | Forbidden> {
    return this.request({
      url: '/config',
      method: 'POST',
      params: params
    });
  }

  async sendAnalytics(
    params: ISendAnalyticsParams
  ): Promise<Success<void> | InvalidParameter> {
    return this.request({
      url: '/analytics',
      method: 'POST',
      params: params
    });
  }

  async getReport(
    params?: IGetReportParams
  ): Promise<Success<void> | Unauthorized | Forbidden> {
    return this.request({
      url: '/admin/report',
      method: 'GET',
      params: params
    });
  }

  async getCustomFiles(
    params?: IGetCustomFilesParams
  ): Promise<Success<IGetCustomFilesResponse>> {
    return this.request({
      url: '/customFiles',
      method: 'GET',
      params: params
    });
  }

  async restartLinkurious(): Promise<Success<IRestartLinkuriousResponse['url']> | Unauthorized | Forbidden> {
    const response: Success<IRestartLinkuriousResponse> | Unauthorized | Forbidden = await this.request({
      url: '/admin/restart',
      method: 'POST'
    });
    if (LkGuards.isSuccess(response)) {
      return {
        ...response,
        response: response.response.url
      };
    }
    return response;
  }
}
