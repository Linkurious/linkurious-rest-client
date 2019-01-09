/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maxime on 08/01/2019.
 *
 * File: success
 * Description :
 */

'use strict';

import { ServerResponse } from './index';

export class Success<T> extends ServerResponse<'success'> {
  public response: T;

  constructor(response: T) {
    super('success');
    this.response = response;
  }
}
