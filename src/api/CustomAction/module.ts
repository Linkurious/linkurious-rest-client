/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

// TS2019-DONE

import {
  DataSourceUnavailable,
  Forbidden,
  InvalidParameter,
  NotFound,
  Unauthorized
} from '../../response/errors';
import {Success} from '../../response/success';
import {Module} from '../Module';

import {
  ICreateCustomActionParams,
  ICreateCustomActionResponse,
  IDeleteCustomActionParams,
  IUpdateCustomActionParams,
  IUpdateCustomActionResponse,
  IGetCustomActionsParams,
  GetCustomActionsResponse
} from './types';

export class CustomActionModule extends Module {
  public async getCustomActions(
    params?: IGetCustomActionsParams
  ): Promise<Success<GetCustomActionsResponse> | Unauthorized | Forbidden | DataSourceUnavailable> {
    return this.request({
      url: '/{sourceKey}/customAction',
      method: 'GET',
      params: params
    });
  }

  public async createCustomAction(
    params: ICreateCustomActionParams
  ): Promise<
    | Success<ICreateCustomActionResponse>
    | Unauthorized
    | Forbidden
    | DataSourceUnavailable
    | InvalidParameter
  > {
    return this.request({
      url: '/admin/{sourceKey}/customAction',
      method: 'POST',
      params: params
    });
  }

  public async updateCustomAction(
    params: IUpdateCustomActionParams
  ): Promise<
    | Success<IUpdateCustomActionResponse>
    | Unauthorized
    | Forbidden
    | DataSourceUnavailable
    | NotFound
    | InvalidParameter
  > {
    return this.request({
      url: '/admin/{sourceKey}/customAction/{id}',
      method: 'PATCH',
      params: params
    });
  }

  public async deleteCustomAction(
    params: IDeleteCustomActionParams
  ): Promise<Success<void> | Unauthorized | Forbidden | DataSourceUnavailable | NotFound> {
    return this.request({
      url: '/admin/{sourceKey}/customAction/{id}',
      method: 'DELETE',
      params: params
    });
  }
}
