/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-05-27.
 *
 * File:
 * Description :
 */
'use strict';

import { IHttpDriver, IHttpResponse, IFetchConfig, IDataToSend, IFetcherClientState } from '../../index';
import { LinkuriousError } from '../LinkuriousError';
import { DefaultHttpDriver } from './DefaultHttpDriver';
import { Logger } from '../log/Logger';
import { Utils } from './utils';

export class Fetcher {
  private static SOURCE_KEY_TEMPLATE: string = '{dataSourceKey}';
  private static SOURCE_INDEX_TEMPLATE: string = '{dataSourceIndex}';
  private static OBJECT_ID_TEMPLATE: string = '{id}';
  protected _httpDriver: IHttpDriver;
  private _logger: Logger;
  private readonly _baseUrl: string;
  private _clientState: IFetcherClientState;
  private readonly _baseApiURL: string;

  constructor(logger: Logger, clientState: IFetcherClientState, baseUrl: string, httpDriver?: IHttpDriver) {
    this._httpDriver = httpDriver ? httpDriver : new DefaultHttpDriver();
    this._logger = logger;
    this._clientState = clientState;
    this._baseUrl = baseUrl.substr(baseUrl.length - 1) === '/' ? baseUrl : baseUrl + '/';
    this._baseApiURL = this._baseUrl + 'api';
  }

  /**
   * HTTPDriver wrapper method
   *
   * @param {IFetchConfig} configData
   * @returns {Promise.<*>} the response body
   */
  public fetch(configData: {
    url: string;
    method: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
    ignoreContentType?: boolean;
    dataSource?: string | number;
    body?: any;
    query?: any;
  }): Promise<any> {
    let config: IFetchConfig = JSON.parse(JSON.stringify(configData));

    if (this._clientState.guestMode) {
      if (!configData.query) {
        configData.query = {
          guest: true,
        };
      } else {
        configData.query.guest = true;
      }
    }

    let cachedQuery: any;
    if (!configData.query) {
      cachedQuery = {
        _: Date.now(),
      };
    } else {
      cachedQuery = JSON.parse(JSON.stringify(configData.query));
      cachedQuery._ = Date.now();
    }

    let data: IDataToSend = {
      queryData: cachedQuery,
      bodyData: config.body,
    };

    if (config.url.indexOf('http://') < 0) {
      try {
        config.url = this.transformUrl(config, data);
      } catch (lkError) {
        return Promise.reject(lkError);
      }
    }

    let responsePromise: Promise<IHttpResponse>;

    if (config.method === 'GET') {
      responsePromise = (<any>this._httpDriver)[config.method](
        config.url,
        Utils.fixSnakeCase(data.queryData),
        config.ignoreContentType
      );
    } else {
      responsePromise = (<any>this._httpDriver)[config.method](
        config.url,
        data.bodyData,
        Utils.fixSnakeCase(data.queryData)
      );
    }

    return responsePromise
      .catch((error: Error) => {
        // create a linkurious error from "hard" errors
        return Promise.reject(LinkuriousError.fromError(error));
      })
      .then((response: IHttpResponse) => {
        // create a linkurious error from "soft" error
        if (LinkuriousError.isError(response)) {
          let linkuriousError: any = LinkuriousError.fromHttpResponse(response);
          return Promise.reject(linkuriousError);
        }
        // resolve with response body in case of success
        return response.body;
      })
      .catch((error: LinkuriousError) => {
        // logging interceptor
        this._logger.error(error);
        return Promise.reject(error);
      });
  }

  /**
   * transform url to add current source key or a specific source key if exists in config
   *
   * @param url
   * @param explicitSource
   * @return {string}
   */
  private addSourceKeyToUrl(url: string, explicitSource?: string | number): string {
    if (explicitSource && typeof explicitSource === 'string') {
      return this._baseApiURL + url.replace(Fetcher.SOURCE_KEY_TEMPLATE, explicitSource);
    } else if (this._clientState.currentSource) {
      return this._baseApiURL + url.replace(Fetcher.SOURCE_KEY_TEMPLATE, this._clientState.currentSource.key);
    } else {
      if (explicitSource && typeof explicitSource !== 'string') {
        throw LinkuriousError.fromClientError('state_error', `Source key must be a string.`);
      } else {
        throw LinkuriousError.fromClientError(
          'state_error',
          `You need to set a current source to fetch this API (${url}).`
        );
      }
    }
  }

  /**
   * transform url to add current source index or a specific source index if exists in config
   *
   * @param url
   * @param explicitSource
   * @return {string}
   */
  private addSourceIndexToUrl(url: string, explicitSource?: string | number): string {
    if (explicitSource && typeof explicitSource === 'number') {
      return this._baseApiURL + url.replace(Fetcher.SOURCE_INDEX_TEMPLATE, explicitSource + '');
    } else if (this._clientState.currentSource) {
      return (
        this._baseApiURL + url.replace(Fetcher.SOURCE_INDEX_TEMPLATE, this._clientState.currentSource.configIndex + '')
      );
    } else {
      if (explicitSource && typeof explicitSource !== 'number') {
        throw LinkuriousError.fromClientError('state_error', `Source index must be a number.`);
      } else {
        throw LinkuriousError.fromClientError(
          'state_error',
          `You need to set a current source to fetch this API (${url}).`
        );
      }
    }
  }

  /**
   * transform url to add id
   *
   * @param url
   * @param body
   * @param query
   * @return {string}
   */
  private handleIdInUrl(url: string, body: any, query: any): string {
    if (body) {
      let id: number | string = body.id;
      delete body.id;
      return url.replace(Fetcher.OBJECT_ID_TEMPLATE, encodeURIComponent(id + ''));
    }

    if (query) {
      let id: number = query.id;
      delete query.id;
      return url.replace(Fetcher.OBJECT_ID_TEMPLATE, encodeURIComponent(id + ''));
    }

    throw LinkuriousError.fromClientError('state_error', `You need an ID to fetch this API (${url}).`);
  }

  /**
   * parse url and return transformed url
   *
   * @param config
   * @param data
   * @return {string}
   */
  private transformUrl(config: IFetchConfig, data: IDataToSend): string {
    if (config.url.indexOf(Fetcher.OBJECT_ID_TEMPLATE) >= 0) {
      config.url = this.handleIdInUrl(config.url, data.bodyData, data.queryData);
    }

    if (config.url.indexOf(Fetcher.SOURCE_KEY_TEMPLATE) >= 0) {
      return this.addSourceKeyToUrl(config.url, config.dataSource);
    } else if (config.url.indexOf(Fetcher.SOURCE_INDEX_TEMPLATE) >= 0) {
      return this.addSourceIndexToUrl(config.url, config.dataSource);
    } else {
      return this._baseApiURL + config.url;
    }
  }
}
