/* tslint:disable:no-console */
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
  public debug(message:string):void {
    console.debug(message);
  }

  public error(message:string):void {
    console.error(message);
  }
}
