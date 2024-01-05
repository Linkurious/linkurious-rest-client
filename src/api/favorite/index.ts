/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2024
 *
 * - Created on 2024-01-05.
 */
import {LkErrorKey} from '../../http/response';
import {Request} from '../../http/request';

import {CreateFavoriteParams, DeleteFavoriteParams} from './types';

export * from './types';

const {UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND} = LkErrorKey;

export class FavoriteAPI extends Request {
  /**
   * Create a new user favorite item.
   */
  createFavorite(params: CreateFavoriteParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE, NOT_FOUND],
      url: '/:sourceKey/favorites/:type/:itemId',
      method: 'POST',
      params: params
    });
  }

  /**
   * Delete an existing user favorite item.
   */
  deleteFavorite(params: DeleteFavoriteParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE, NOT_FOUND],
      url: '/:sourceKey/favorites/:type/:itemId',
      method: 'DELETE',
      params: params
    });
  }
}
