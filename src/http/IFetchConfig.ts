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

export interface IFetchConfig {
  url: string;
  method: 'POST'|'GET'|'PUT'|'DELETE'|'PATCH';
  dataSource?: string;
  body?: any;
  query?: any;
}
