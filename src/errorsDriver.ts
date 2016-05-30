/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-04-26.
 *
 * File:
 * Description :
 */
'use strict';

import * as i from './interfaces';

function getErrorType(status:number):string {
  if (status === 401 || status === 403) {
    return 'access';
  } else if (status >= 500) {
    return 'technical'
  } else {
    return 'business';
  }
}

export function format(res:any, body:i.ErrorBody):i.ResponseBody {
  let errorMessage = <i.ResponseBody>{};

  errorMessage.status  = res.statusCode;
  errorMessage.type    = getErrorType(res.statusCode);
  errorMessage.key     = body.key;
  errorMessage.message = body.message;

  return errorMessage;
}