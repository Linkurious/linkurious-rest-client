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

import {HttpResponse, HttpDriver, Source, FetcherConfig} from './interfaces';
import LinkuriousError from './LinkuriousError';
import DefaultHttpDriver from './DefaultHttpDriver';
import Logger from './Logger';

export default class Fetcher {

  private httpDriver: HttpDriver;
  private logger: Logger;
  private host: string;
  private currentSource: Source.clientModel;

  constructor(logger: Logger, currentSource: Source.clientModel, host: string, httpDriver?: HttpDriver){
    this.httpDriver = httpDriver ? httpDriver : new DefaultHttpDriver();
    this.logger = logger;
    this.currentSource = currentSource;
    this.host = host;
  }

  /**
   * construct the API URL with sourceId if needed and throw error if doesn't exists.
   *
   * @param {string} uri The url fragment to format the API url
   * @param {string} dataSource
   * @returns {string} - return the API url formatted
   */
  private transformUrl(uri:string, dataSource?:string): string {

    const dataSourceTest = /\{dataSource}/;

    if (dataSourceTest.test(uri)) {
      if(dataSource){
        return this.host + '/api' + uri.replace(dataSourceTest, dataSource);
      } else if (this.currentSource) {
        let currentSource: Source.clientModel = this.currentSource;
        return this.host + '/api' + uri.replace(dataSourceTest, currentSource.key);
      } else {
        this.logger.error(LinkuriousError.fromClientError(
          'configuration_error',
          'You need to set a current source to fetch this API.'
        ));
        throw new Error('You need to set a current source to fetch this API.');
      }
    } else {
      return this.host + '/api' + uri;
    }
  }

  /**
   * HTTPDriver wrapper method
   *
   * @param {FetcherConfig} config
   * @returns {Promise.<object>} the response body
   */
  public fetch(config: FetcherConfig): Promise<any> {
    let url = this.transformUrl(config.url, config.dataSource);
    let fetchPromise;

    if(config.method === 'GET'){
      fetchPromise = this.httpDriver[config.method](url, config.query)
    } else {
      fetchPromise = this.httpDriver[config.method](url, config.data)
    }

    return fetchPromise.catch((error: Error) => {
      // create a linkurious error from "hard" errors
      return Promise.reject(LinkuriousError.fromError(error));

    }).then((response: HttpResponse) => {

      // create a linkurious error from "soft" error
      if (response.statusCode <= 1 || response.statusCode >= 400) {
        var linkuriousError = LinkuriousError.fromHttpResponse(response);
        return Promise.reject(linkuriousError);
      }

      // resolve with response body in case of success
      return response.body;

    }).catch((error: LinkuriousError) => {
      // logging interceptor
      this.logger.error(error);
      return Promise.reject(error);
    });
  }
}