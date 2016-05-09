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

import {IncomingMessage} from "http";
import {ResponseBody} from './errorsDriver.interfaces';
import {ErrorBody} from './logDriver.interfaces';

function setErrorType(status:number):string {
  if (status === 401 || status === 403) {
    return 'access';
  } else if (status >= 500) {
    return 'communication'
  } else {
    return 'business';
  }
}

export function format(res:IncomingMessage, body:ErrorBody):ResponseBody {
  let errorMessage = <ResponseBody>{};

  errorMessage.status  = res.statusCode;
  errorMessage.type    = setErrorType(res.statusCode);
  errorMessage.key     = body.key;
  errorMessage.message = body.message;

  return errorMessage;
}