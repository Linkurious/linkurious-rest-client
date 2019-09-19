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
} from '../response/errors';
import {Success} from '../response/success';
import {
  ICreateCustomActionParams,
  ICreateCustomActionResponse,
  IDeleteCustomActionParams,
  IUpdateCustomActionParams,
  IUpdateCustomActionResponse,
  IGetCustomActionsParams,
  GetCustomActionsResponse
} from '../models/CustomAction';

import {Module} from './Module';

export class CustomActionModule extends Module {
  public async createCustomAction(
    options: ICreateCustomActionParams
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
      body: options,
      path: {
        sourceKey: options.sourceKey
      }
    });
  }

  public async deleteCustomAction(
    options: IDeleteCustomActionParams
  ): Promise<Success<void> | Unauthorized | Forbidden | DataSourceUnavailable | NotFound> {
    return this.request({
      url: '/admin/{sourceKey}/customAction/{id}',
      method: 'DELETE',
      path: {
        sourceKey: options.sourceKey,
        id: options.id
      }
    });
  }

  public async updateCustomAction(
    options: IUpdateCustomActionParams
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
      body: options,
      path: {
        sourceKey: options.sourceKey,
        id: options.id
      }
    });
  }

  public async getCustomActions(
    options: IGetCustomActionsParams
  ): Promise<Success<GetCustomActionsResponse> | Unauthorized | Forbidden | DataSourceUnavailable> {
    return this.request({
      url: '/{sourceKey}/customAction',
      method: 'GET',
      path: {
        sourceKey: options.sourceKey
      }
    });
  }
}
