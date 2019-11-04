/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-24.
 */

import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';

import {
  CreateCustomActionResponse,
  GetCustomActionsResponse,
  ICreateCustomActionParams,
  IDeleteCustomActionParams,
  IGetCustomActionsParams,
  IUpdateCustomActionParams,
  UpdateCustomActionResponse
} from './types';

export * from './types';

const {UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED, FORBIDDEN, NOT_FOUND} = LkErrorKey;

export class CustomActionAPI extends Request {
  /**
   * Get all the custom actions owned by the current user or shared with them.
   */
  public async getCustomActions(params?: IGetCustomActionsParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED, FORBIDDEN).request<
      GetCustomActionsResponse
    >({
      url: '/:sourceKey/customAction',
      method: 'GET',
      params: params
    });
  }

  // TODO investigate on when Invalid Parameter is used as business error and fix that
  /**
   * Create a new custom action for the current user.
   */
  public async createCustomAction(params: ICreateCustomActionParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN).request<
      CreateCustomActionResponse
    >({
      url: '/:sourceKey/customAction',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update a custom action owned by the current user.
   */
  public async updateCustomAction(params: IUpdateCustomActionParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request<
      UpdateCustomActionResponse
    >({
      url: '/:sourceKey/customAction/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Delete a custom action owned by the current user.
   */
  public async deleteCustomAction(params: IDeleteCustomActionParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request({
      url: '/:sourceKey/customAction/:id',
      method: 'DELETE',
      params: params
    });
  }
}
