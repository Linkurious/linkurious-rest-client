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

import * as i from './interfaces';

// todo: this is declared twice (here and in interfaces.LoggerPlugin). Chose one.
interface LoggerInterface {
  debug:Function;
  error:Function;
}

// todo: these could be static fields of the "Logger" class
const DEFAULT_DEBUG_LOGGER = console.debug;
const DEFAULT_ERROR_LOGGER = console.error;

// todo: this is not a driver, this is a logger. LoggerInterface is a driver
// todo: rename to "Logger"
export default class LogDriver {

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

  // todo: this probably takes a LinkuriousError as parameter, not a ServerError. Specific names help.
  public debug(logBody:i.ErrorBody):void {
    if (this.level === 'debug') {
      this.logger.debug(logBody.key);
      this.logger.debug(logBody.message);
    }
  }

  // todo: see debug
  public error(logBody:i.ErrorBody):void {
    if (this.level === 'error' || this.level === 'debug') {
      this.logger.error(logBody.key);
      this.logger.error(logBody.message);
    }
  }
}