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

import * as i from './interfaces';
import HttpDriver from './HTTPDriver';

export default class Fetcher {

  httpDriver:i.HTTPDriver;
  log:i.LogDriver;
  host:string;
  private currentSource:i.Source.clientModel;

  constructor(logger, currentSource, host){
    this.httpDriver = <i.HTTPDriver> new HttpDriver();
    this.log = <i.LogDriver>logger;
    this.currentSource = <i.Source.clientModel>currentSource;
    this.host = <string>host;
  }

  /**
   * construct the API URL with sourceId if needed and throw error if doesn't exists.
   *
   * @param uri:string     - the url fragment to format the API url
   * @returns {string}      - return the API url formatted
   */
  private transformUrl(uri:string):string {

    const dataSourceTest = /\{dataSource}/;
    if (dataSourceTest.test(uri)) {
      if (this.currentSource) {
        let currentSource = <i.Source.clientModel>this.currentSource;
        return this.host + '/api' + uri.replace(dataSourceTest, currentSource.key);
      } else {
        this.log.error({
          key    : 'Configuration error',
          message: 'You need to set a current source to fetch this API.'
        });
        throw new Error('You need to set a current source to fetch this API.');
      }
    } else {
      return this.host + '/api' + uri;
    }
  }

  /**
   * HTTPDriver wrapper method
   *
   * @param method{string}    - the method for the HTTP request to send
   * @param uri{string}       - the url fragment to format
   * @param data{object}     -
   * @returns {Promise}
   */
  public fetch(method:string, uri:string, data?:any):Promise<any> {

    let url = this.transformUrl(uri),
        fetch = this.httpDriver[method](url, data);

    return fetch
      .then((res) => res)
      .catch((err) => {
        this.log.error({
          key    : err.status + ' - ' + err.type,
          message: err.message
        });

        return Promise.reject(err);
      });
  }
}