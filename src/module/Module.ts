/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-05-30.
 *
 * File:
 * Description :
 */

import {RequestConfig} from '../../index';
import {ErrorListener} from '../errorListener';
import {Fetcher} from '../http/fetcher';
import {Rejection} from '../response/errors';
import {Success} from '../response/success';
import {Transformer} from '../transformer';

export abstract class Module {
  private _fetcher: Fetcher;
  private _transformer: Transformer;
  private _errorListener: ErrorListener;

  constructor(fetcher: Fetcher, transformer: Transformer, errorListener: ErrorListener) {
    this._fetcher = fetcher;
    this._transformer = transformer;
    this._errorListener = errorListener;
  }

  protected fetch(config: {
    url: string;
    method: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
    ignoreContentType?: boolean;
    dataSource?: string | number;
    body?: any;
    query?: any;
  }): Promise<any> {
    return this._fetcher.fetch(config);
  }

  protected async request<R, T>(config: RequestConfig<R, T>): Promise<Success<T> | Rejection> {
    const response = await this._transformer.transform(this._fetcher.fetch(config), config);
    if (response.isError()) {
      this._errorListener.dispatch(response as Rejection);
    }
    return response;
  }
}
