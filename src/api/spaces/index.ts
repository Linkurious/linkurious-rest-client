/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2022
 *
 * - Created on 2022-08-04.
 */

import {LkErrorKey} from '../../http/response';
import {Request} from '../../http/request';
import {IDataSourceParams} from '../commonTypes';

import {
  ICreateSpaceParams,
  IDeleteSpaceParams,
  IGetSpaceParams,
  ISpace,
  IUpdateSpaceParams
} from './types';

export * from './types';

const {UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND} = LkErrorKey;

export class SpacesAPI extends Request {
  /**
   * Create a new space.
   */
  public createSpace(this: Request<ISpace>, params: ICreateSpaceParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE, NOT_FOUND],
      url: '/:sourceKey/spaces',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update an existing space.
   */
  public updateSpace(this: Request<ISpace>, params: IUpdateSpaceParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE, NOT_FOUND],
      url: '/:sourceKey/spaces/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Delete an existing space.
   */
  public deleteSpace(params: IDeleteSpaceParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE, NOT_FOUND],
      url: '/:sourceKey/spaces/:id',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Get space list.
   */
  public getSpaces(this: Request<ISpace[]>, params?: IDataSourceParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE],
      url: '/:sourceKey/spaces',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get a space by id.
   */
  public getSpace(this: Request<ISpace>, params: IGetSpaceParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE, NOT_FOUND],
      url: '/:sourceKey/spaces/:id',
      method: 'GET',
      params: params
    });
  }
}