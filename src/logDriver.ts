/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-04-27.
 *
 * File:
 * Description :
 */
'use strict';

import {LogDriverInterface, ErrorBody} from './logDriver.interfaces';

interface LoggerInterface {
  debug:Function;
  error:Function;
}

const DEFAULT_DEBUG_LOGGER = console.debug;
const DEFAULT_ERROR_LOGGER = console.error;

export default class LogDriver implements LogDriverInterface {

  public level:string;
  public logger:LoggerInterface;

  constructor(level:string, logger?:LoggerInterface) {
    this.level  = level;
    this.logger = <LoggerInterface> {};

    if (!logger) logger = <LoggerInterface> {};
    if (!logger.debug) logger.debug = DEFAULT_DEBUG_LOGGER;
    if (!logger.error) logger.error = DEFAULT_ERROR_LOGGER;

    this.logger = logger;
  }

  public debug(logBody:ErrorBody):void {
    if (this.level === 'debug') {
      this.logger.debug(logBody.key);
      this.logger.debug(logBody.message);
    }
  }

  public error(logBody:ErrorBody):void {
    if (this.level === 'error' || this.level === 'debug') {
      this.logger.error(logBody.key);
      this.logger.error(logBody.message);
    }
  }
}