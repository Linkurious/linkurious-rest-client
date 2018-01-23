/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-05-30.
 *
 * File:
 * Description :
 */
'use strict';

import { Fetcher } from '../http/fetcher';

/**
 * @abstract
 */
export class Module {
  private _fetcher:Fetcher;

  constructor ( fetcher:Fetcher ) {
    this._fetcher = fetcher;
  }

  protected fetch ( config:{
    url:string;
    method:'POST'|'GET'|'PUT'|'DELETE'|'PATCH';
    ignoreContentType?:boolean;
    dataSource?:string|number;
    body?:any;
    query?:any;
  } ):Promise<any> {
    return this._fetcher.fetch(config);
  }
}
