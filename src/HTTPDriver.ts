/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-04-26.
 *
 * File: HTTPDriver.ts
 * Description : Wrapper for HTTP requests + promises
 */
'use strict';

import * as request from 'request';
import * as ErrorsDriver from './errorsDriver';
import {HTTPDriverInterface} from './HTTPDriver.interfaces';
import {CookieJar} from "~request/index";

interface Config {
  method: string;
  uri   : string;
  json  : boolean;
  body  ?: any;
  jar   : CookieJar;
  qs    ?: any;
  data  ?: any;
}

export default class HTTPDriver implements HTTPDriverInterface {
  public cookieJar:CookieJar;

  constructor() {
    this.cookieJar = <CookieJar>request.jar();
  }

  private createConfig(method:string, uri:string, data?:any):Config {
    let conf = {
      method : method,
      uri : uri,
      json : true,
      jar : this.cookieJar
    };

    if(data && method !== 'GET'){
      conf['body'] = data;
    }

    if(data && method === 'GET') {
      conf['qs'] = data;
    }

    return conf;
  }

  POST(uri:string, data?:any):Promise<any> {
    let config = this.createConfig('POST', uri, data);

    return new Promise((resolve:Function, reject:Function) => {
      request(config, (err, res, body) => {
        if (res.statusCode >= 400) {
          return reject(ErrorsDriver.format(res, body));
        } else {
          return resolve(body);
        }
      });
    });
  }

  PUT(uri:string, data:any):Promise<any> {
    let config = this.createConfig('PUT', uri, data);

    return new Promise((resolve:Function, reject:Function) => {
      request(config, (err, res, body) => {
        if (res.statusCode >= 400) {
          return reject(ErrorsDriver.format(res, body));
        } else {
          return resolve(body);
        }
      });
    });
  }

  PATCH(uri:string, data:any):Promise<any> {
    let config = this.createConfig('PATCH', uri, data);

    return new Promise((resolve:Function, reject:Function) => {
      request(config, (err, res, body) => {
        if (res.statusCode >= 400) {
          return reject(ErrorsDriver.format(res, body));
        } else {
          return resolve(body);
        }
      });
    });
  }

  GET(uri:string, data?:any):Promise<any> {
    let config = this.createConfig('GET', uri, data);
    return new Promise((resolve:any, reject:any) => {
      request(config, (err, res, body) => {
        if (res.statusCode >= 400) {
          return reject(ErrorsDriver.format(res, body));
        } else {
          return resolve(body);
        }
      });
    });
  }

  DELETE(uri:string, data?:any):Promise<any> {
    let config = this.createConfig('DELETE', uri, data);

    return new Promise((resolve:any, reject:any) => {
      request(config, (err, res, body) => {
        if (res.statusCode >= 400) {
          return reject(ErrorsDriver.format(res, body));
        } else {
          return resolve(body);
        }
      });
    });
  }
};