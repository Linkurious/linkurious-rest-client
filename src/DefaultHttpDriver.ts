/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-04-26.
 *
 * File: HTTPDriver.ts
 * Description : Wrapper for HTTP requests + promises
 */
/// <reference path="./../typings/main/ambient/superagent/index.d.ts" />

'use strict';

import * as request from 'superagent';
import {HttpResponse, HttpDriver} from './interfaces';

export default class DefaultHttpDriver implements HttpDriver {
  private cookie: string;

  constructor() {
    this.cookie = '';
  }

  private handleResponse(resolve: Function, reject: Function, err: Error, res: HttpResponse) {
    if ((typeof res.statusCode !== 'number' || res.statusCode < 100) && err) {
      return reject(err);
    }

    if (res.header && res.header['set-cookie']){
      this.cookie = res.header['set-cookie'];
    }

    resolve(res);
  }

  POST(uri:string, data?:any):Promise<HttpResponse> {
    return new Promise((resolve:Function, reject:Function) => {
      request
        .post(uri)
        .send(data)
        .set('cookie', this.cookie)
        .withCredentials()
        .end(function(err, res) {
          this.handleResponse(resolve, reject, err, res);
        }.bind(this));
    });
  }

  PUT(uri:string, data:any):Promise<HttpResponse> {
    return new Promise((resolve:Function, reject:Function) => {
      request
        .put(uri)
        .send(data)
        .set('cookie', this.cookie)
        .withCredentials()
        .end(function(err, res) {
          this.handleResponse(resolve, reject, err, res);
        }.bind(this));
    });
  }

  PATCH(uri:string, data:any):Promise<HttpResponse> {
    return new Promise((resolve:Function, reject:Function) => {
      request
        .patch(uri)
        .send(data)
        .set('cookie', this.cookie)
        .withCredentials()
        .end(function(err, res) {
          this.handleResponse(resolve, reject, err, res);
        }.bind(this));
    });
  }

  GET(uri:string, data?:any):Promise<HttpResponse> {
    return new Promise((resolve:any, reject:any) => {
      request
        .get(uri)
        .query(data)
        .set('cookie', this.cookie)
        .withCredentials()
        .end(function(err, res) {
          this.handleResponse(resolve, reject, err, res);
        }.bind(this));
    });
  }

  DELETE(uri:string, data?:any):Promise<HttpResponse> {
    return new Promise((resolve:any, reject:any) => {
      request
        .del(uri)
        .send(data)
        .set('cookie', this.cookie)
        .withCredentials()
        .end(function(err, res) {
          this.handleResponse(resolve, reject, err, res);
        }.bind(this));
    });
  }
}
