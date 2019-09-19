/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-01-08.
 */

import {ServerResponse} from './index';

export class Success<T> extends ServerResponse<'success'> {
  public response: T | undefined;

  constructor(response: T) {
    super('success');
    this.response = response;
  }
}
