/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maxime on 08/01/2019.
 *
 * File: index
 * Description :
 */

'use strict';

import { ServerRejection, RejectionKey } from './errors';
import { Success } from './success';

export abstract class ServerResponse<T extends 'success' | RejectionKey> {
  public readonly key: T;

  protected constructor(key: T) {
    this.key = key;
  }

  public isSuccess(): this is Success<any> {
    return this.key === 'success';
  }
  public isError(): this is ServerRejection {
    return this.key !== 'success';
  }
}
