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
import * as ErrorsDriver from './errorsDriver';

export default class HTTPDriver {

  private cookie:string;

  constructor() {
    this.cookie = <string>'';
  }

  POST(uri:string, data?:any):Promise<any> {
    return new Promise((resolve:Function, reject:Function) => {
      request
        .post(uri)
        .send(data)
        .set('cookie', this.cookie)
        .withCredentials()
        .end(function(err, res){
          if(res.header && res.header['set-cookie']){
            this.cookie = res.header['set-cookie'];
          }

          if (res.status >= 400) {
            return reject(ErrorsDriver.formatToLinkuriousError(res, res.body));
          } else {
            return resolve(res.body);
          }
        }.bind(this));
    });
  }

  PUT(uri:string, data:any):Promise<any> {
    return new Promise((resolve:Function, reject:Function) => {
      request
        .put(uri)
        .send(data)
        .set('cookie', this.cookie)
        .withCredentials()
        .end(function(err, res){
          if (res.status >= 400) {
            return reject(ErrorsDriver.formatToLinkuriousError(res, res.body));
          } else {
            return resolve(res.body);
          }
        })
    });
  }

  PATCH(uri:string, data:any):Promise<any> {
    return new Promise((resolve:Function, reject:Function) => {
      request
        .patch(uri)
        .send(data)
        .set('cookie', this.cookie)
        .withCredentials()
        .end(function(err, res){
          if (res.status >= 400) {
            return reject(ErrorsDriver.formatToLinkuriousError(res, res.body));
          } else {
            return resolve(res.body);
          }
        })
    });
  }

  GET(uri:string, data?:any):Promise<any> {
    return new Promise((resolve:any, reject:any) => {
      request
        .get(uri)
        .query(data)
        .set('cookie', this.cookie)
        .withCredentials()
        .end(function(err, res){
          if (res.status >= 400) {
            return reject(ErrorsDriver.formatToLinkuriousError(res, res.body));
          } else {
            return resolve(res.body);
          }
        })
    });
  }

  DELETE(uri:string, data?:any):Promise<any> {
    return new Promise((resolve:any, reject:any) => {
      request
        .del(uri)
        .send(data)
        .set('cookie', this.cookie)
        .withCredentials()
        .end(function(err, res){
          if (res.status >= 400) {
            return reject(ErrorsDriver.formatToLinkuriousError(res, res.body));
          } else {
            return resolve(res.body);
          }
        })
    });
  }
};