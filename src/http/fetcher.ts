/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2016-05-27.
 */

import {
  FetcherConfig,
  IClientState,
  IDataToSend,
  IFetchConfig,
  IHttpDriver,
  IHttpResponse
} from '../../index';
import { LinkuriousError } from '../LinkuriousError';
import { Logger } from '../log/Logger';
import { DefaultHttpDriver } from './DefaultHttpDriver';
import { Utils } from './utils';

export class Fetcher {
  private static SOURCE_KEY_TEMPLATE: string = '{sourceKey}';
  private static SOURCE_INDEX_TEMPLATE: string = '{dataSourceIndex}';
  private static OBJECT_ID_TEMPLATE: string = '{id}';
  protected _httpDriver: IHttpDriver;
  private _logger: Logger;
  private readonly _baseUrl: string;
  private _clientState: IClientState;
  private readonly _apiBaseURL: string;

  constructor(
    logger: Logger,
    clientState: IClientState,
    baseUrl: string,
    httpDriver?: IHttpDriver
  ) {
    this._httpDriver = httpDriver ? httpDriver : new DefaultHttpDriver();
    this._logger = logger;
    this._clientState = clientState;
    this._baseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    this._apiBaseURL = this._baseUrl + 'api';
  }

  protected get baseUrl(): string {
    return this._baseUrl;
  }

  /**
   * HTTPDriver wrapper method
   */
  public async fetchResponse(configData: FetcherConfig): Promise<IHttpResponse> {
    const config: IFetchConfig = configData;
    const cachedQuery = configData.query
      ? Utils.clone(configData.query)
      : {};
    // @ts-ignore
    cachedQuery._ = Date.now();

    if (this._clientState.guestMode) {
      // @ts-ignore
      cachedQuery.guest = true;
    }

    const data: IDataToSend = {
      queryData: cachedQuery,
      bodyData: config.body
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
      responsePromise = (this._httpDriver as any)[config.method](
        config.url,
        Utils.fixSnakeCase(data.queryData),
        config.ignoreContentType,
        config.agent
      );
    } else {
      responsePromise = (this._httpDriver as any)[config.method](
        config.url,
        data.bodyData,
        Utils.fixSnakeCase(data.queryData),
        config.agent
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
          throw LinkuriousError.fromHttpResponse(response);
        }
        // resolve with response in case of success
        return response;
      })
      .catch((error: LinkuriousError) => {
        // logging interceptor
        this._logger.error(error);
        return Promise.reject(error);
      });
  }

  /**
   * HTTPDriver wrapper method
   */
  public async fetch(configData: FetcherConfig): Promise<any> {
    const response = await this.fetchResponse(configData);
    return response.body;
  }

  private addSourceKeyToUrl(url: string): string {
    if (this._clientState.currentSource) {
      return url.replace(Fetcher.SOURCE_KEY_TEMPLATE, this._clientState.currentSource.key);
    } else {
      throw LinkuriousError.fromClientError(
        'state_error',
        `You need to set a current source to fetch this API (${url}).`
      );
    }
  }

  /**
   * transform url to add current source index or a specific source index if exists in config
   */
  private addSourceIndexToUrl(url: string, explicitSource?: string | number): string {
    if (explicitSource && typeof explicitSource === 'number') {
      return url.replace(Fetcher.SOURCE_INDEX_TEMPLATE, explicitSource + '');
    } else if (this._clientState.currentSource) {
      return url.replace(
        Fetcher.SOURCE_INDEX_TEMPLATE,
        this._clientState.currentSource.configIndex + ''
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
   */
  private handleIdInUrl(url: string, body: any, query: any): string {
    if (body) {
      const id: number | string = body.id;
      delete body.id;
      return url.replace(Fetcher.OBJECT_ID_TEMPLATE, encodeURIComponent(id + ''));
    }

    if (query) {
      const id: number = query.id;
      delete query.id;
      return url.replace(Fetcher.OBJECT_ID_TEMPLATE, encodeURIComponent(id + ''));
    }

    throw LinkuriousError.fromClientError(
      'state_error',
      `You need an ID to fetch this API (${url}).`
    );
  }

  private injectPathParams(url: string, pathParams: {[key: string]: string} = {}): string {
    for (const key of Object.keys(pathParams)) {
      if (pathParams[key] !== undefined) {
        url = url.replace(`{${key}}`, encodeURIComponent(pathParams[key]));
      }
    }

    if (url.includes(Fetcher.SOURCE_KEY_TEMPLATE)) {
      return this.addSourceKeyToUrl(url);
    }

    return url;
  }

  /**
   * parse url and return transformed url
   */
  private transformUrl(config: IFetchConfig, data: IDataToSend): string {
    config.url = this.injectPathParams(config.url, config.path);

    if (config.url.indexOf(Fetcher.OBJECT_ID_TEMPLATE) >= 0) {
      config.url = this.handleIdInUrl(config.url, data.bodyData, data.queryData);
    }

    if (config.url.indexOf(Fetcher.SOURCE_INDEX_TEMPLATE) >= 0) {
      config.url = this.addSourceIndexToUrl(config.url, config.dataSource);
    }

    return this._apiBaseURL + config.url;
  }
}
