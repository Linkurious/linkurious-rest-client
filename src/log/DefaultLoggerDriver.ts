/* tslint:disable:no-console */
/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * Created by david on 2016-05-27.
 *
 * File:
 * Description :
 */

import {ILoggerDriver} from './../../index';

export class DefaultLoggerDriver implements ILoggerDriver {
  public debug(message: string): void {
    console.debug(message);
  }

  public error(message: string): void {
    console.error(message);
  }
}
