/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by david on 2016-04-27.
 *
 * File:
 * Description :
 */
'use strict';

export interface ILoggerDriver {
  debug:(message:string) => void;
  error:(message:string) => void;
}
