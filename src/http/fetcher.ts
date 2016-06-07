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

import {IClientState} from './../interfaces';
import LinkuriousError from './../LinkuriousError';
import DefaultHttpDriver from './DefaultHttpDriver';
import {Logger} from './../log/Logger';
import {IHttpDriver} from './IHttpDriver';
import {IHttpResponse} from './IHttpResponse';
import {IFetchConfig, IDataSourceRelative, IDataToSend} from './IFetchConfig';
import Utils from './utils';

export default class Fetcher {

  private static SOURCE_KEY_TEMPLATE:string   = '{dataSourceKey}';
  private static SOURCE_INDEX_TEMPLATE:string = '{dataSourceIndex}';
  private static OBJECT_ID_TEMPLATE:string    = '{id}';
  private _httpDriver:IHttpDriver;
  private _logger:Logger;
  private _host:string;
  private _clientState:IClientState;
  private _baseUrl:string;

  constructor(logger:Logger, clientState:IClientState, host:string, httpDriver?:IHttpDriver) {
    this._httpDriver    = httpDriver ? httpDriver : new DefaultHttpDriver();
    this._logger        = logger;
    this._clientState   = clientState;
    this._host          = host;
    this._baseUrl       = this._host + '/api';
  }

  /**
   * HTTPDriver wrapper method
   *
   * @param {IFetchConfig} config
   * @returns {Promise.<*>} the response body
   */
  public fetch(config:IFetchConfig):Promise<any> {

    let data:IDataToSend = {
      queryData: config.query,
      bodyData : config.body
    };

    config.url = this.transformUrl(config, data);

    let responsePromise:Promise<IHttpResponse>;

    if (config.method === 'GET') {
      responsePromise = (<any> this._httpDriver)[config.method](
        config.url, Utils.fixSnakeCase(data.queryData)
      );
    } else {
      responsePromise = (<any> this._httpDriver)[config.method](
        config.url, data.bodyData, Utils.fixSnakeCase(data.queryData)
      );
    }

    return responsePromise.catch((error:Error) => {
      // console.log(JSON.stringify(error.stack.split(/\s*\n\s*/), null, ' '));

      // create a linkurious error from "hard" errors
      return Promise.reject(LinkuriousError.fromError(error));

    }).then((response:IHttpResponse) => {

      // create a linkurious error from "soft" error
      if (LinkuriousError.isError(response)) {
        let linkuriousError:any = LinkuriousError.fromHttpResponse(response);
        return Promise.reject(linkuriousError);
      }

      // resolve with response body in case of success
      return response.body;

    }).catch((error:LinkuriousError) => {
      // logging interceptor
      this._logger.error(error);
      return Promise.reject(error);
    });
  }

  private addSourceKeyToUrl(url:string, explicitSource?:IDataSourceRelative):string {
    if (explicitSource) {
      return this._baseUrl + url.replace(Fetcher.SOURCE_KEY_TEMPLATE, explicitSource.dataSourceKey);
    } else if (this._clientState.currentSource) {
      return this._baseUrl + url.replace(Fetcher.SOURCE_KEY_TEMPLATE, this._clientState.currentSource.key);
    } else {
      this._logger.error(LinkuriousError.fromClientError(
        'state_error',
        `You need to set a current source to fetch this API (${url}).`
      ));
      return;
    }
  }

  private addSourceIndexToUrl(url:string, explicitSource?:IDataSourceRelative):string {
    if (explicitSource) {
      return this._baseUrl + url.replace(Fetcher.SOURCE_INDEX_TEMPLATE, explicitSource.dataSourceIndex + '');
    } else if (this._clientState.currentSource) {
      return this._baseUrl + url.replace(Fetcher.SOURCE_INDEX_TEMPLATE, this._clientState.currentSource.key);
    } else {
      this._logger.error(LinkuriousError.fromClientError(
        'state_error',
        `You need to set a current source to fetch this API (${url}).`
      ));
      return;
    }
  }

  private handleIdInUrl(url:string, body:any, query:any):string {
    if (body) {
      let id:number = body.id;
      delete body.id;
      return url.replace(Fetcher.OBJECT_ID_TEMPLATE, id + '');
    }

    if (query) {
      let id:number = query.id;
      delete query.id;
      return url.replace(Fetcher.OBJECT_ID_TEMPLATE, id + '');
    }

    this._logger.error(LinkuriousError.fromClientError(
      'state_error',
      `You need an ID to fetch this API (${url}).`
    ));
    return;
  }

  private transformUrl(config:IFetchConfig, data:IDataToSend):string {
    if (config.url.indexOf(Fetcher.OBJECT_ID_TEMPLATE) >= 0) {
      config.url = this.handleIdInUrl(config.url, data.bodyData, data.queryData);
    }

    if (config.url.indexOf(Fetcher.SOURCE_KEY_TEMPLATE) >= 0) {
      return this.addSourceKeyToUrl(config.url, config.dataSource);
    } else if (config.url.indexOf(Fetcher.SOURCE_INDEX_TEMPLATE) >= 0) {
      return this.addSourceIndexToUrl(config.url, config.dataSource);
    } else {
      return this._baseUrl + config.url;
    }
  }
}
