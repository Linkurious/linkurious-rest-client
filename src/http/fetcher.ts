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

import {DataSource} from '../interfaces';
import LinkuriousError from '../LinkuriousError';
import DefaultHttpDriver from './DefaultHttpDriver';
import {Logger} from '../log/Logger';
import {IHttpDriver} from './IHttpDriver';
import {IHttpResponse} from './IHttpResponse';
import {IFetchConfig} from './IFetchConfig';

export default class Fetcher {

  private _httpDriver: IHttpDriver;
  private _logger: Logger;
  private _host: string;
  private _currentSource: DataSource.clientModel;

  constructor(logger: Logger, currentSource: DataSource.clientModel, host: string, httpDriver?: IHttpDriver){
    this._httpDriver = httpDriver ? httpDriver : new DefaultHttpDriver();
    this._logger = logger;
    this._currentSource = currentSource;
    this._host = host;
  }

  /**
   * construct the API URL with sourceId if needed and throw error if doesn't exists.
   *
   * @param uri:string     - the url fragment to format the API url
   * @param dataSource:string - the sourceKey
   * @returns {string}      - return the API url formatted
   */
  private transformUrl(uri:string, dataSource?:string): string {
    // todo: handle configIndex vs sourceKey parameters (depending on APIs)
    const sourceKeyTemplate = '{dataSource}';

    if (uri.indexOf(sourceKeyTemplate) >= 0) {
      if (dataSource) {
        // explicit dataSource
        return this._host + '/api' + uri.replace(sourceKeyTemplate, dataSource);
      } else if (this._currentSource) {
        // current dataSource
        let currentSource: DataSource.clientModel = this._currentSource;
        return this._host + '/api' + uri.replace(sourceKeyTemplate, currentSource.key);
      } else {
        //
        this._logger.error(LinkuriousError.fromClientError(
          'state_error',
          `You need to set a current source to fetch this API (${uri}).`
        ));
        throw new Error('You need to set a current source to fetch this API.');
      }
    } else {
      return this._host + '/api' + uri;
    }
  }

  /**
   * HTTPDriver wrapper method
   *
   * @param {IFetchConfig} config
   * @returns {Promise.<*>} the response body
   */
  public fetch(config: IFetchConfig): Promise<any> {

    config.url = this.transformUrl(config.url, config.dataSource);
    let responsePromise: Promise<IHttpResponse>;

    if (config.method === 'GET') {
      responsePromise = (<any> this._httpDriver)[config.method](config.url, config.query);
    } else {
      responsePromise = (<any> this._httpDriver)[config.method](config.url, config.body);
    }

    return responsePromise.catch((error: Error) => {
      //console.log(JSON.stringify(error.stack.split(/\s*\n\s*/), null, ' '));

      // create a linkurious error from "hard" errors
      return Promise.reject(LinkuriousError.fromError(error));

    }).then((response: IHttpResponse) => {

      // create a linkurious error from "soft" error
      if (LinkuriousError.isError(response)) {
        var linkuriousError = LinkuriousError.fromHttpResponse(response);
        return Promise.reject(linkuriousError);
      }

      // resolve with response body in case of success
      return response.body;

    }).catch((error: LinkuriousError) => {
      // logging interceptor
      this._logger.error(error);
      return Promise.reject(error);
    });
  }
}