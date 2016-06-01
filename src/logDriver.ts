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

export default class Logger {

  public level:string;
  public logger:i.LoggerPlugin;
  private static DEFAULT_DEBUG_LOGGER = console.debug;
  private static DEFAULT_ERROR_LOGGER = console.error;

  constructor(level:string, logger?:i.LoggerPlugin) {
    this.level  = level;
    this.logger = <i.LoggerPlugin> {};

    if (!logger) logger = <i.LoggerPlugin> {};
    if (!logger.debug) logger.debug = Logger.DEFAULT_DEBUG_LOGGER;
    if (!logger.error) logger.error = Logger.DEFAULT_ERROR_LOGGER;

    this.logger = logger;
  }

  public debug(linkuriousError:i.LinkuriousError):void {
    if (this.level === 'debug') {
      this.logger.debug(linkuriousError.key);
      this.logger.debug(linkuriousError.message);
    }
  }

  public error(linkuriousError:i.LinkuriousError):void {
    if (this.level === 'error' || this.level === 'debug') {
      this.logger.error(linkuriousError.key);
      this.logger.error(linkuriousError.message);
    }
  }
}