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
import { IFetchConfig } from '../../index';

/**
 * @abstract
 */
export class Module {
  private _fetcher:Fetcher;

  constructor ( fetcher:Fetcher ) {
    this._fetcher = fetcher;
  }

  protected fetch ( config:IFetchConfig ):Promise<any> {
    return this._fetcher.fetch(config);
  }

  protected setDataSourceKey ( dataSourceKey:string ):any {
    return dataSourceKey ? { dataSourceKey: dataSourceKey } : undefined;
  }
}
