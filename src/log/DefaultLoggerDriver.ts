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

import {ILoggerDriver} from './ILoggerDriver';

export default class DefaultLoggerDriver implements ILoggerDriver {
  debug(message:string) {
    console.debug(message);
  }

  error(message:string) {
    console.error(message);
  }
}