/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2016-05-27.
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
