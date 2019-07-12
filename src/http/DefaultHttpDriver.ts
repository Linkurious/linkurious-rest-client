/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2016-04-26.
 */

import * as https from 'https';
import * as request from 'superagent';
import { SuperAgentRequest } from 'superagent';
import {IHttpDriver, IHttpResponse} from '../../index';
import {LinkuriousError} from '../LinkuriousError';

export class DefaultHttpDriver implements IHttpDriver {
  /**
   * Optionally set the request agent.
   */
  private static withAgent<R extends SuperAgentRequest>(
    requesting: R,
    agent?: https.Agent): R {
    if (agent) {
      // the browser version of superagent does not support calls to agent
      // so we add it only when agent is explicitly defined
      // this avoids printing this warning: 'This is not supported in browser version of superagent'
      return requesting.agent(agent);
    }
    return requesting;
  }

  public POST(uri: string, data?: any, query?: any, agent?: https.Agent): Promise<IHttpResponse> {
    return new Promise((resolve: (r: IHttpResponse) => void, reject: (e: any) => void) => {
      DefaultHttpDriver.withAgent(request.post(uri), agent)
        .withCredentials()
        .send(data)
        .query(query)
        .end((err: any, res: request.Response) => {
          this.handleResponse(resolve, reject, err, res);
        });
    });
  }

  public PUT(uri: string, data: any, query?: any, agent?: https.Agent): Promise<IHttpResponse> {
    return new Promise((resolve: (r: IHttpResponse) => void, reject: (e: any) => void) => {
      DefaultHttpDriver.withAgent(request.put(uri), agent)
        .withCredentials()
        .send(data)
        .query(query)
        .end((err: any, res: request.Response) => {
          this.handleResponse(resolve, reject, err, res);
        });
    });
  }

  public PATCH(uri: string, data: any, query?: any, agent?: https.Agent): Promise<IHttpResponse> {
    return new Promise((resolve: (r: IHttpResponse) => void, reject: (e: any) => void) => {
      DefaultHttpDriver.withAgent(request.patch(uri), agent)
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
    agent?: https.Agent
  ): Promise<IHttpResponse> {
    return new Promise((resolve: (r: IHttpResponse) => void, reject: (e: any) => void) => {
      return DefaultHttpDriver.withAgent(request.get(uri), agent)
        .withCredentials()
        .query(query)
        .end((err: any, res: request.Response) => {
        this.handleResponse(resolve, reject, err, res, ignoreContentType);
      });
    });
  }

  public DELETE(uri: string, data?: any, query?: any, agent?: https.Agent): Promise<IHttpResponse> {
    return new Promise((resolve: (r: IHttpResponse) => void, reject: (e: any) => void) => {
      DefaultHttpDriver.withAgent(request.del(uri), agent)
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
