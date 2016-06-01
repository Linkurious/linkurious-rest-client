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

import {HttpResponse, HttpDriver, Source, FetchConfig} from './interfaces';
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
   * @param uri:string     - the url fragment to format the API url
   * @param dataSource:string - the sourceKey
   * @returns {string}      - return the API url formatted
   */
  private transformUrl(uri:string, dataSource?:string): string {
    // todo: handle configIndex vs sourceKey parameters (depending on APIs)
    const dataSourceTest = /\{dataSource}/;

    if (dataSourceTest.test(uri)) {
      if (dataSource) {
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
   * @param {FetchConfig} config
   * @returns {Promise.<object>} the response body
   */
  public fetch(config: FetchConfig): Promise<any> {

    // clone config + inject current source (if no explicit source)
    let configCopy = global.JSON.parse(global.JSON.stringify(config));
    if (configCopy.dataSource === undefined && this.currentSource) {
      configCopy.dataSource = this.currentSource.key;
    }

    configCopy.url = this.transformUrl(configCopy.url, configCopy.dataSource);
    let responsePromise;

    if (configCopy.method === 'GET'){
      responsePromise = this.httpDriver[configCopy.method](configCopy.url, configCopy.query);
    } else {
      responsePromise = this.httpDriver[configCopy.method](configCopy.url, configCopy.body);
    }

    return responsePromise.catch((error: Error) => {
      //console.log(JSON.stringify(error.stack.split(/\s*\n\s*/), null, ' '));

      // create a linkurious error from "hard" errors
      return Promise.reject(LinkuriousError.fromError(error));

    }).then((response: HttpResponse) => {

      // create a linkurious error from "soft" error
      if (LinkuriousError.isError(response)) {
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