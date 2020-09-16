/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-24.
 */

import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';
import {IDataSourceParams} from '../commonTypes';

import {
  CustomAction,
  ICreateCustomActionParams,
  IDeleteCustomActionParams,
  IUpdateCustomActionParams
} from './types';

export * from './types';

const {
  UNAUTHORIZED,
  DATA_SOURCE_UNAVAILABLE,
  GUEST_DISABLED,
  FORBIDDEN,
  NOT_FOUND,
  MALFORMED_CUSTOM_ACTION_TEMPLATE
} = LkErrorKey;

export class CustomActionAPI extends Request {
  /**
   * Get all the custom actions owned by the current user or shared with them.
   */
  public getCustomActions(this: Request<CustomAction[]>, params?: IDataSourceParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED, FORBIDDEN],
      url: '/:sourceKey/customAction',
      method: 'GET',
      params: params
    });
  }

  /**
   * Create a new custom action for the current user.
   */
  public createCustomAction(this: Request<CustomAction>, params: ICreateCustomActionParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, MALFORMED_CUSTOM_ACTION_TEMPLATE],
      url: '/:sourceKey/customAction',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update a custom action owned by the current user.
   */
  public updateCustomAction(this: Request<CustomAction>, params: IUpdateCustomActionParams) {
    return this.request({
      errors: [
        UNAUTHORIZED,
        DATA_SOURCE_UNAVAILABLE,
        FORBIDDEN,
        NOT_FOUND,
        MALFORMED_CUSTOM_ACTION_TEMPLATE
      ],
      url: '/:sourceKey/customAction/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Delete a custom action owned by the current user.
   */
  public deleteCustomAction(params: IDeleteCustomActionParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND],
      url: '/:sourceKey/customAction/:id',
      method: 'DELETE',
      params: params
    });
  }
}
