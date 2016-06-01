/**
 * Created by david on 01/06/16.
 */

import {HttpResponse} from './interfaces';

export type ErrorType = 'client'|'communication'|'access'|'technical'|'business';

export default class LinkuriousError {
  public status: number;
  public type: ErrorType;
  public key: string;
  public message: string;

  constructor(status: number, type: ErrorType, key: string, message: string) {
    this.status = status;
    this.type = type;
    this.key = key;
    this.message = message;
  }

  public static fromHttpResponse(r: HttpResponse) {
    let status = r.statusCode;
    let type: ErrorType = LinkuriousError.getErrorType(r.statusCode);
    let key, message;

    if (type === 'communication') {
      key = 'communication_error';
      message = 'Could not get response from server';

    } else {
      key = r.body.key;
      message = r.body.message;
    }

    return new LinkuriousError(status, type, key, message);
  }

  public static fromError(error: Error): LinkuriousError {
    return new LinkuriousError(
      0,
      'communication',
      'unknown_error',
      global.JSON.stringify(error.message ? error.message : error)
    );
  }

  public static fromClientError(key: string, message: string) {
    return new LinkuriousError(0, 'client', key, message);
  }

  public static isError(r: HttpResponse): boolean {
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
      return 'technical'
    } else {
      return 'business';
    }
  }
}
