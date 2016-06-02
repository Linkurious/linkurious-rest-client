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

import LinkuriousError from '../LinkuriousError';
import {ILoggerDriver} from './ILoggerDriver';
import DefaultLoggerDriver from './DefaultLoggerDriver';

export type LogLevel = 'debug'|'error'|'quiet';

const LOG_LEVELS: Map<LogLevel, number> = new Map<LogLevel, number>();
LOG_LEVELS.set('debug', 0);
LOG_LEVELS.set('error', 1);
LOG_LEVELS.set('quiet', 99);

export class Logger {
  public level: LogLevel;
  private numericalLevel: number;
  public driver: ILoggerDriver;

  constructor(level: LogLevel, driver?: ILoggerDriver) {
    this.level = level;
    this.numericalLevel = LOG_LEVELS.get(level);
    this.driver = driver ? driver : new DefaultLoggerDriver();
  }

  public debug(error: LinkuriousError): void {
    this.log('debug', error);
  }

  public error(error: LinkuriousError): void {
    this.log('error', error)
  }

  private log(level: LogLevel, error: LinkuriousError) {
    if (LOG_LEVELS.get(level) >= this.numericalLevel) {
      this.driver[level](`[${error.type}] ${error.key}: ${error.message}`);
    }
  }
}
