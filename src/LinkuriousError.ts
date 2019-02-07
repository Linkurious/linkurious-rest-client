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

export type ErrorType = 'client' | 'communication' | 'access' | 'technical' | 'business';

export class LinkuriousError {
  public status: number;
  public type: ErrorType;
  public key: string;
  public message: string;
  public cause: Error;
  public data: any;

  constructor(status: number, type: ErrorType, key: string, message: string, cause?: Error, data?: any) {
    this.status = status;
    this.type = type;
    this.key = key;
    this.message = message;
    this.cause = cause;
    this.data = data;
  }

  public static fromHttpResponse(r: { statusCode: number; body: any; header: any }): LinkuriousError {
    let status: number = r.statusCode;
    let type: ErrorType = LinkuriousError.getErrorType(r.statusCode);
    let key: string;
    let message: string;
    let data: any;

    if (type === 'communication') {
      key = 'communication_error';
      message = 'Could not get response from server';
    } else {
      key = r.body.key;
      message = r.body.message;
      data = r.body.data;
    }

    return new LinkuriousError(status, type, key, message, undefined, data);
  }

  public static fromError(
    error: Error,
    type?: 'client' | 'communication' | 'access' | 'technical' | 'business'
  ): LinkuriousError {
    return new LinkuriousError(
      0,
      type ? type : 'communication',
      'critical',
      error.message ? `${error.name}: ${error.message}` : JSON.stringify(error),
      error
    );
  }

  get stack(): string {
    return this.cause ? this.cause.stack : undefined;
  }

  get stackArray(): Array<string> {
    return this.stack === undefined ? [] : this.stack.split(/\n/g);
  }

  public static fromClientError(key: string, message: string): LinkuriousError {
    return new LinkuriousError(0, 'client', key, message);
  }

  public static isError(r: { statusCode: number; body: any; header: any }): boolean {
    return r.statusCode === undefined || r.statusCode < 100 || r.statusCode >= 400;
  }

  private static getErrorType(status: number): ErrorType {
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
