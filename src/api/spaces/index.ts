/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2022
 *
 * - Created on 2022-08-04.
 */

import {LkErrorKey} from '../../http/response';
import {Request} from '../../http/request';
import {IDataSourceParams, PaginatedResponse} from '../commonTypes';

import {
  GetMySpacesWithTreeResponse,
  IAdminSpace,
  ICreateSpaceParams,
  IDeleteSpaceParams,
  IGetSpacesParams,
  ISpace,
  IUpdateSpaceParams
} from './types';

export * from './types';

const {UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND, SPACE_DELETION_FAILED} =
  LkErrorKey;

export class SpacesAPI extends Request {
  /**
   * Create a new space.
   */
  public createSpace(this: Request<IAdminSpace>, params: ICreateSpaceParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE, NOT_FOUND],
      url: '/admin/:sourceKey/spaces',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update an existing space.
   */
  public updateSpace(this: Request<IAdminSpace>, params: IUpdateSpaceParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE, NOT_FOUND],
      url: '/admin/:sourceKey/spaces/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Delete an existing space.
   */
  public deleteSpace(params: IDeleteSpaceParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE, NOT_FOUND, SPACE_DELETION_FAILED],
      url: '/admin/:sourceKey/spaces/:id',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * List all spaces (including the ones that are not shared with the current user). Provide
   * support for pagination.
   */
  public getAllSpaces(this: Request<PaginatedResponse<IAdminSpace>>, params?: IGetSpacesParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE],
      url: '/admin/:sourceKey/spaces',
      method: 'GET',
      params: params
    });
  }

  /**
   * List the spaces shared with the current user.
   */
  public getSpacesSharedWithMe(this: Request<ISpace[]>, params?: IDataSourceParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE],
      url: '/:sourceKey/spaces',
      method: 'GET',
      params: params
    });
  }

  /**
   * List the spaces shared with the current user, with the corresponding visualization tree
   * attached to each space.
   */
  public getMySpacesWithTree(
    this: Request<GetMySpacesWithTreeResponse>,
    params?: IDataSourceParams
  ) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE],
      url: '/:sourceKey/spaces/tree',
      method: 'GET',
      params: params
    });
  }
}
