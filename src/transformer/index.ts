/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maxime on 2019-03-13.
 *
 * File: index
 * Description :
 */

'use strict';

import { RequestConfig } from '../../index';
import { Rejection } from '../response/errors';
import { Success } from '../response/success';

export class Transformer {
  public async transform<R, T>(
    promise: Promise<unknown>,
    configuration: RequestConfig<R, T>
  ): Promise<Success<T> | Rejection> {
    let result: T;
    try {
      result = await Transformer.applyTransform(promise, configuration);
    } catch (e) {
      return new Rejection(e);
    }

    return new Success(result);
  }

  /**
   * If transform exists in configuration, apply transformation, else return result with expected type
   */
  private static async applyTransform<R, T>(promise: Promise<unknown>, configuration: RequestConfig<R, T>): Promise<T> {
    const result = await promise;
    if (configuration.transform !== undefined) {
      return configuration.transform(result as R);
    } else {
      return result as T;
    }
  }
}
