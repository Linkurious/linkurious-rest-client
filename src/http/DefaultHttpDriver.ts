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
import { IHttpResponse, IHttpDriver } from './../../index';
import { LinkuriousError } from '../LinkuriousError';

export class DefaultHttpDriver implements IHttpDriver {
  private cookie:string;

  constructor () {
    this.cookie = '';
  }

  public POST (
    uri:string,
    data?:any,
    query?:any
  ):Promise<IHttpResponse> {
    return new Promise(
      (
        resolve:( r:IHttpResponse ) => void,
        reject:( e:any ) => void
      ) => {
        request
          .post(uri)
          .withCredentials()
          .send(data)
          .query(query)
          .end(
            (
              err:any,
              res:request.Response
            ) => {
              this.handleResponse(resolve, reject, err, res);
            }
          );
      }
    );
  }

  public PUT (
    uri:string,
    data:any,
    query?:any
  ):Promise<IHttpResponse> {
    return new Promise(
      (
        resolve:( r:IHttpResponse ) => void,
        reject:( e:any ) => void
      ) => {
        request
          .put(uri)
          .withCredentials()
          .send(data)
          .query(query)
          .end(
            (
              err:any,
              res:request.Response
            ) => {
              this.handleResponse(resolve, reject, err, res);
            }
          );
      }
    );
  }

  public PATCH (
    uri:string,
    data:any,
    query?:any
  ):Promise<IHttpResponse> {
    return new Promise(
      (
        resolve:( r:IHttpResponse ) => void,
        reject:( e:any ) => void
      ) => {
        request
          .patch(uri)
          .withCredentials()
          .send(data)
          .query(query)
          .end(
            (
              err:any,
              res:request.Response
            ) => {
              this.handleResponse(resolve, reject, err, res);
            }
          );
      }
    );
  }

  public GET (
    uri:string,
    query?:any,
    contentType?:string
  ):Promise<IHttpResponse> {
    return new Promise(
      (
        resolve:( r:IHttpResponse ) => void,
        reject:( e:any ) => void
      ) => {
        request
          .get(uri)
          .withCredentials()
          .query(query)
          .set('Accept', (!contentType) ? 'application/json' : contentType)
          .end(
            (
              err:any,
              res:request.Response
            ) => {
              this.handleResponse(resolve, reject, err, res, contentType);
            }
          );
      }
    );
  }

  public DELETE (
    uri:string,
    data?:any,
    query?:any
  ):Promise<IHttpResponse> {
    return new Promise(
      (
        resolve:( r:IHttpResponse ) => void,
        reject:( e:any ) => void
      ) => {
        request
          .del(uri)
          .withCredentials()
          .send(data)
          .query(query)
          .end(
            (
              err:any,
              res:request.Response
            ) => {
              this.handleResponse(resolve, reject, err, res);
            }
          );
      }
    );
  }

  private handleResponse (
    resolve:( r:IHttpResponse ) => void,
    reject:( error:any ) => void,
    err:Error,
    res:request.Response,
    contentType?:string
  ):void {

    if ( !res ) {
      return reject(
        LinkuriousError.fromClientError(
          'communication_error',
          'offline'
        )
      );
    }

    if ( (typeof res.status !== 'number' || res.status < 100) && err ) {
      return reject(err);
    }

    if (!contentType && res.type !== 'application/json' ) {
      return reject(
        LinkuriousError.fromClientError(
          'communication_error',
          'Wrong content-type'
        )
      );
    }

    if ( res.header && res.header['set-cookie'] ) {
      this.cookie = res.header['set-cookie'];
    }

    resolve(
      {
        statusCode: res.status,
        body      : (contentType) ? res.text : res.body,
        header    : res.header
      }
    );
  }
}
