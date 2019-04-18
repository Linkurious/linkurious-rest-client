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

import { LinkuriousError } from '../LinkuriousError';
import { ILoggerDriver } from './../../index';
import { DefaultLoggerDriver } from './DefaultLoggerDriver';

export type LogLevel = 'debug' | 'error' | 'quiet';

const LOG_LEVELS: any = {
  debug: 0,
  error: 1,
  quiet: 99,
};

export class Logger {
  public level: LogLevel;
  public driver: ILoggerDriver;
  private numericalLevel: number;

  constructor(level: LogLevel, driver?: ILoggerDriver) {
    this.level = level;
    this.numericalLevel = LOG_LEVELS[level];
    this.driver = driver ? driver : new DefaultLoggerDriver();
  }

  public debug(error: LinkuriousError): void {
    this.log('debug', error);
  }

  public error(error: LinkuriousError): void {
    this.log('error', error);
  }

  private log(level: LogLevel, error: LinkuriousError): void {
    if (LOG_LEVELS[level] >= this.numericalLevel) {
      (<any>this.driver)[level](`[${error.type}] ${error.key}: ${error.message}`);
    }
  }
}
