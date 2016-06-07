/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-04-26.
 *
 * File: HTTPDriver.ts
 * Description : Wrapper for HTTP requests + promises
 */

import * as request from 'superagent';
import {IHttpResponse} from './IHttpResponse';
import {IHttpDriver} from './IHttpDriver';

export class DefaultHttpDriver implements IHttpDriver {
  private cookie:string;

  constructor() {
    this.cookie = '';
  }

  public POST(uri:string, data?:any, query?:any):Promise<IHttpResponse> {
    return new Promise((resolve:(r:IHttpResponse) => void, reject:(e:any) => void) => {
      request
        .post(uri)
        .send(data)
        .query(query)
        .set('cookie', this.cookie)
        .withCredentials()
        .end((err:any, res:request.Response) => {
          this.handleResponse(resolve, reject, err, res);
        });
    });
  }

  public PUT(uri:string, data:any, query?:any):Promise<IHttpResponse> {
    return new Promise((resolve:(r:IHttpResponse) => void, reject:(e:any) => void) => {
      request
        .put(uri)
        .send(data)
        .query(query)
        .set('cookie', this.cookie)
        .withCredentials()
        .end((err:any, res:request.Response) => {
          this.handleResponse(resolve, reject, err, res);
        });
    });
  }

  public PATCH(uri:string, data:any, query?:any):Promise<IHttpResponse> {
    return new Promise((resolve:(r:IHttpResponse) => void, reject:(e:any) => void) => {
      request
        .patch(uri)
        .send(data)
        .query(query)
        .set('cookie', this.cookie)
        .withCredentials()
        .end((err:any, res:request.Response) => {
          this.handleResponse(resolve, reject, err, res);
        });
    });
  }

  public GET(uri:string, query?:any):Promise<IHttpResponse> {
    return new Promise((resolve:(r:IHttpResponse) => void, reject:(e:any) => void) => {
      request
        .get(uri)
        .query(query)
        .set('cookie', this.cookie)
        .withCredentials()
        .end((err:any, res:request.Response) => {
          this.handleResponse(resolve, reject, err, res);
        });
    });
  }

  public DELETE(uri:string, data?:any, query?:any):Promise<IHttpResponse> {
    return new Promise((resolve:(r:IHttpResponse) => void, reject:(e:any) => void) => {
      request
        .del(uri)
        .send(data)
        .query(query)
        .set('cookie', this.cookie)
        .withCredentials()
        .end((err:any, res:request.Response) => {
          this.handleResponse(resolve, reject, err, res);
        });
    });
  }

  private handleResponse(resolve:(r:IHttpResponse) => void,
                         reject:(error:any) => void,
                         err:Error,
                         res:request.Response):void {

    if ((typeof res.status !== 'number' || res.status < 100) && err) {
      return reject(err);
    }

    if (res.header && res.header['set-cookie']) {
      this.cookie = res.header['set-cookie'];
    }

    resolve({
      statusCode: res.status,
      body      : res.body,
      header    : res.header
    });
  }
}
