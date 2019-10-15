/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-01-08.
 */

import {Rejection, RejectionKey} from './errors';
import {Success} from './success';

export abstract class ServerResponse<T extends 'success' | RejectionKey> {
  public readonly key: T;

  protected constructor(key: T) {
    this.key = key;
  }

  public isSuccess(): this is Success<any> {
    return this.key === 'success';
  }
  public isError(): this is Rejection {
    return this.key !== 'success';
  }
}
