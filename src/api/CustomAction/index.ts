/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-24.
 */
import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';

import {
  ICreateCustomActionParams,
  ICreateCustomActionResponse,
  IDeleteCustomActionParams,
  IUpdateCustomActionParams,
  IUpdateCustomActionResponse,
  IGetCustomActionsParams,
  GetCustomActionsResponse
} from './types';

const {FORBIDDEN, UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, INVALID_PARAMETER, NOT_FOUND} = LkErrorKey;

export class CustomActionAPI extends Request {
  public async getCustomActions(params?: IGetCustomActionsParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE).request<
      GetCustomActionsResponse
    >({
      url: '/:sourceKey/customAction',
      method: 'GET',
      params: params
    });
  }

  public async createCustomAction(params: ICreateCustomActionParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE, INVALID_PARAMETER).request<
      ICreateCustomActionResponse
    >({
      url: '/:sourceKey/customAction',
      method: 'POST',
      params: params
    });
  }

  public async updateCustomAction(params: IUpdateCustomActionParams) {
    return this.handle(
      UNAUTHORIZED,
      FORBIDDEN,
      DATA_SOURCE_UNAVAILABLE,
      NOT_FOUND,
      INVALID_PARAMETER
    ).request<IUpdateCustomActionResponse>({
      url: '/:sourceKey/customAction/:id',
      method: 'PATCH',
      params: params
    });
  }

  public async deleteCustomAction(params: IDeleteCustomActionParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE, NOT_FOUND).request<void>({
      url: '/:sourceKey/customAction/:id',
      method: 'DELETE',
      params: params
    });
  }
}
