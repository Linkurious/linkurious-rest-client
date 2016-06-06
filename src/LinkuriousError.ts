/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by david on 2016-05-27.
 *
 * File:
 * Description :
 */
'use strict';

import {IHttpResponse} from './http/IHttpResponse';

export type ErrorType = 'client'|'communication'|'access'|'technical'|'business';

export default class LinkuriousError {
  public status:number;
  public type:ErrorType;
  public key:string;
  public message:string;
  public cause:Error;

  constructor (status:number, type:ErrorType, key:string, message:string, cause?:Error) {
    this.status  = status;
    this.type    = type;
    this.key     = key;
    this.message = message;
    this.cause   = cause;
  }

  public static fromHttpResponse (r:IHttpResponse):LinkuriousError {
    let status:number  = r.statusCode;
    let type:ErrorType = LinkuriousError.getErrorType(r.statusCode);
    let key:string;
    let message:string;

    if (type === 'communication') {
      key     = 'communication_error';
      message = 'Could not get response from server';

    } else {
      key     = r.body.key;
      message = r.body.message;
    }

    return new LinkuriousError(status, type, key, message);
  }

  public static fromError (error:Error):LinkuriousError {
    return new LinkuriousError(
      0,
      'communication',
      'unknown_error',
      error.message ? `${error.name}: ${error.message}` : JSON.stringify(error),
      error
    );
  }

  get stack():string {
    return this.cause ? this.cause.stack : undefined;
  }

  get stackArray():Array<string> {
    return this.stack === undefined ? [] : this.stack.split('\s*\n\s*');
  }

  public static fromClientError (key:string, message:string):LinkuriousError {
    return new LinkuriousError(0, 'client', key, message);
  }

  public static isError (r:IHttpResponse):boolean {
    return r.statusCode === undefined || r.statusCode < 100 || r.statusCode >= 400;
  }

  private static getErrorType (status:number):ErrorType {
    if (status === undefined) {
      return 'communication';
    } else if (status < 100) {
      return 'communication';
    } else if (status === 401 || status === 403) {
      return 'access';
    } else if (status >= 500) {
      return 'technical';
    } else {
      return 'business';
    }
  }
}
