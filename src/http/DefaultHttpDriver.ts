/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2016-04-26.
 */

import * as request from 'superagent';
import {SuperAgentRequest} from 'superagent';

import {IHttpDriver, IHttpResponse} from '../../index';
import {LinkuriousError} from '../LinkuriousError';

export type SuperAgent = request.SuperAgent<SuperAgentRequest>;

export class DefaultHttpDriver implements IHttpDriver {
  public POST(uri: string, data?: any, query?: any, agent?: SuperAgent): Promise<IHttpResponse> {
    return new Promise((resolve: (r: IHttpResponse) => void, reject: (e: any) => void) => {
      (agent ? agent : request)
        .post(uri)
        .withCredentials()
        .send(data)
        .query(query)
        .end((err: any, res: request.Response) => {
          this.handleResponse(resolve, reject, err, res);
        });
    });
  }

  public PUT(uri: string, data: any, query?: any, agent?: SuperAgent): Promise<IHttpResponse> {
    return new Promise((resolve: (r: IHttpResponse) => void, reject: (e: any) => void) => {
      (agent ? agent : request)
        .put(uri)
        .withCredentials()
        .send(data)
        .query(query)
        .end((err: any, res: request.Response) => {
          this.handleResponse(resolve, reject, err, res);
        });
    });
  }

  public PATCH(uri: string, data: any, query?: any, agent?: SuperAgent): Promise<IHttpResponse> {
    return new Promise((resolve: (r: IHttpResponse) => void, reject: (e: any) => void) => {
      (agent ? agent : request)
        .patch(uri)
        .withCredentials()
        .send(data)
        .query(query)
        .end((err: any, res: request.Response) => {
          this.handleResponse(resolve, reject, err, res);
        });
    });
  }

  public GET(
    uri: string,
    query?: any,
    ignoreContentType?: boolean,
    agent?: SuperAgent
  ): Promise<IHttpResponse> {
    return new Promise((resolve: (r: IHttpResponse) => void, reject: (e: any) => void) => {
      (agent ? agent : request)
        .get(uri)
        .withCredentials()
        .query(query)
        .end((err: any, res: request.Response) => {
          this.handleResponse(resolve, reject, err, res, ignoreContentType);
        });
    });
  }

  public DELETE(uri: string, data?: any, query?: any, agent?: SuperAgent): Promise<IHttpResponse> {
    return new Promise((resolve: (r: IHttpResponse) => void, reject: (e: any) => void) => {
      (agent ? agent : request)
        .del(uri)
        .withCredentials()
        .send(data)
        .query(query)
        .end((err: any, res: request.Response) => {
          this.handleResponse(resolve, reject, err, res);
        });
    });
  }

  private handleResponse(
    resolve: (r: IHttpResponse) => void,
    reject: (error: any) => void,
    err: Error,
    res: request.Response,
    ignoreContentType?: boolean
  ): void {
    if (!res) {
      return reject(LinkuriousError.fromClientError('communication_error', 'offline'));
    }

    if ((typeof res.status !== 'number' || res.status < 100) && err) {
      return reject(err);
    }

    // CloudFlare removes the content type from request. all request, not just GET.
    // https://secure.helpscout.net/conversation/542800102/2939?folderId=1003309
    /*if (
      !ignoreContentType &&
      (res.header['content-length'] && res.header['content-length'] > 0) &&
      res.status !== 204 &&
      res.type !== 'application/json'
    ) {
      return reject(
        LinkuriousError.fromClientError(
          'communication_error',
          'Wrong content-type'
        )
      );
    }*/

    if (res.type !== null && res.type !== undefined && res.type !== '') {
      resolve({
        statusCode: res.status,
        body: res.body || res.text,
        header: res.header
      });
    } else {
      resolve({
        statusCode: res.status,
        body: res.status !== 204 ? JSON.parse(res.text) : null,
        header: res.header
      });
    }
  }
}
