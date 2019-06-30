/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2016-05-30.
 */

import {cloneDeep} from 'lodash';
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
    path?: any;
  }): Promise<any> {
    return this._fetcher.fetch(config);
  }

  /**
   * Remove path parameters from body and query string params.
   */
  private static sanitizeConfig<R, T>(config: RequestConfig<R, T>): void {
    for (const key of Object.keys(config.path || {})) {
      if (config.body !== undefined) {
        delete config.body[key];
      }

      if (config.query !== undefined) {
        delete config.query[key];
      }
    }
  }

  protected async request<R, T = R>(config: RequestConfig<R, T>): Promise<Success<T> | Rejection> {
    if (config.mock) {
      return new Success(config.mockValue as T);
    }

    config = cloneDeep(config);
    Module.sanitizeConfig(config);
    const response = await this._transformer.transform(this._fetcher.fetch(config), config);

    if (response.isError()) {
      this._errorListener.dispatch(response as Rejection);
    }
    return response;
  }
}
