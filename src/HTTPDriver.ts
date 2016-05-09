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

export default class HTTPDriver implements HTTPDriverInterface {
  public cookieJar:CookieJar;

  constructor() {
    this.cookieJar = <CookieJar>request.jar();
  }

  POST(uri:string, data:any):Promise<any> {
    return new Promise((resolve:Function, reject:Function) => {
      request({
        method: 'POST',
        uri   : uri,
        json  : true,
        body  : data,
        jar   : this.cookieJar
      }, (err, res, body) => {
        if (res.statusCode >= 400) {
          return reject(ErrorsDriver.format(res, body));
        } else {
          return resolve(body);
        }
      });
    });
  }

  PUT(uri:string, data:any):Promise<any> {
    return new Promise((resolve:Function, reject:Function) => {
      request({
        method: 'PUT',
        uri   : uri,
        json  : true,
        body  : data,
        jar   : this.cookieJar
      }, (err, res, body) => {
        if (res.statusCode >= 400) {
          return reject(ErrorsDriver.format(res, body));
        } else {
          return resolve(body);
        }
      });
    });
  }

  PATCH(uri:string, data:any):Promise<any> {
    return new Promise((resolve:Function, reject:Function) => {
      request({
        method: 'PATCH',
        uri   : uri,
        json  : true,
        body  : data,
        jar   : this.cookieJar
      }, (err, res, body) => {
        if (res.statusCode >= 400) {
          return reject(ErrorsDriver.format(res, body));
        } else {
          return resolve(body);
        }
      });
    });
  }

  GET(uri:string, data?:any):Promise<any> {

    let requestConf = {
      method: 'GET',
      uri   : uri,
      json : true,
      jar   : this.cookieJar
    };

    if(data){
      requestConf['qs'] = data;
    }

    return new Promise((resolve:any, reject:any) => {
      request(requestConf, (err, res, body) => {
        if (res.statusCode >= 400) {
          return reject(ErrorsDriver.format(res, body));
        } else {
          return resolve(body);
        }
      });
    });
  }

  DELETE(uri:string, data?:any):Promise<any> {

    let requestConf = {
      method : 'DELETE',
      uri : uri,
      json : true,
      jar : this.cookieJar
    };

    if(data){
      requestConf['data'] = data;
    }
    return new Promise((resolve:any, reject:any) => {
      request(requestConf, (err, res, body) => {
        if (res.statusCode >= 400) {
          return reject(ErrorsDriver.format(res, body));
        } else {
          return resolve(body);
        }
      });
    });
  }
};