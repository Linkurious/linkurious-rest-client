/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-29.
 */
import {
  ICreateGroupParams,
  ICreateGroupResponse,
  ICreateUserParams,
  ICreateUserResponse,
  IDeleteGroupParams,
  IDeleteUserParams,
  IGetGroupParams,
  IGetGroupsResponse,
  IGetGroupsParams,
  IUpdateGroupParams,
  IGetGroupRightsResponse,
  ISetGroupAccessRightsParams,
  IUpdateUserParams,
  IUpdateUserResponse,
  IStartIndexationParams,
  IGetIndexationStatusParams,
  IGetIndexationStatusResponse,
} from './types';
import { Request } from '../../http/request';
import { LkErrorKey } from '../../http/response';

const {INVALID_PARAMETER, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, DATA_SOURCE_UNAVAILABLE, GROUP_EXISTS} = LkErrorKey;

export class AdminApi extends Request {
  /**
   * Add a new user to the application.
   */
  public createUser(params: ICreateUserParams) {
    return this
      .handle(INVALID_PARAMETER, UNAUTHORIZED, FORBIDDEN)
      .request<ICreateUserResponse>({
        url: '/admin/users',
        method: 'POST',
        params: params
      }
    );
  }

  /**
   * Deletes a user in the application.
   *
   * @breakingChange change params from number to IDeleteUserParams for consistency
   * @breakingChange response type is now void instead of boolean
   */
  public deleteUser(params: IDeleteUserParams) {
    return this
      .handle(UNAUTHORIZED, FORBIDDEN)
      .request({
        url: '/admin/users/:id',
        method: 'DELETE',
        params: params
      }
    );
  }

  /**
   * Adds a new group to the application.
   *
   * @breakingChange admin createGroup method signature changed to the new params/response format
   */
  public createGroup(params: ICreateGroupParams) {
    return this
      .handle(
        INVALID_PARAMETER,
        UNAUTHORIZED,
        FORBIDDEN,
        DATA_SOURCE_UNAVAILABLE,
        GROUP_EXISTS)
      .request<ICreateGroupResponse>({
          url: '/admin/:sourceKey/groups',
          method: 'POST',
          params: params
        }
      );
  }

  /**
   * Deletes a group in the application.
   *
   * @breakingChange updateGroup params dataSourceKey is now sourceKey
   */
  public deleteGroup(params: IDeleteGroupParams) {
    return this
      .handle(
        INVALID_PARAMETER,
        UNAUTHORIZED,
        FORBIDDEN,
        NOT_FOUND)
      .request({
          url: '/admin/:sourceKey/groups',
          method: 'DELETE',
          params: params
        }
      );
  }

  /**
   * Update a group (only name).
   *
   * @breakingChange admin updateGroup method signature changed to the new params/response format
   */
  public updateGroup(params: IUpdateGroupParams) {
    return this
      .handle(
        INVALID_PARAMETER,
        UNAUTHORIZED,
        FORBIDDEN,
        NOT_FOUND)
      .request({
          url: '/admin/:sourceKey/groups/:id',
          method: 'PATCH',
          params: params
        }
      );
  }

  /**
   * Get a group already defined in the database.
   *
   * @breakingChange admin getGroup method signature changed to the new params/response format
   */
  public getGroup(params: IGetGroupParams) {
    return this
      .handle(
        INVALID_PARAMETER,
        UNAUTHORIZED,
        FORBIDDEN,
        NOT_FOUND)
      .request<IGetGroupsResponse>({
        url: '/admin/:sourceKey/groups/:id',
        method: 'PATCH',
        params: params
      }
    );
  }

  /**
   * List all the groups for the current source.
   *
   * @breakingChange admin getGroups method signature changed to the new params/response format
   */
  public getGroups(params: IGetGroupsParams) {
    return this
      .handle(
        UNAUTHORIZED,
        FORBIDDEN)
      .request<IGetGroupsResponse[]>({
          url: '/admin/:sourceKey/groups',
          method: 'GET',
          params: params
        }
      );
  }

  /**
   * Get possible targetType, type and action names.
   */
  public getGroupsRights() {
    return this
      .handle(
        UNAUTHORIZED,
        FORBIDDEN)
      .request<IGetGroupRightsResponse[]>({
          url: '/admin/groups/rights_info',
          method: 'GET'
        }
      );
  }

  /**
   * set access rights for a group.
   *
   * @breakingChange admin setGroupAccessRights method signature changed to the new params/response format
   */
  public setGroupAccessRights(params: ISetGroupAccessRightsParams) {
    return this
      .handle(
        INVALID_PARAMETER,
        UNAUTHORIZED,
        FORBIDDEN,
        NOT_FOUND)
      .request({
          url: '/admin/:sourceKey/groups/:id/access_rights',
          method: 'PUT',
          params: params
        }
      );
  }

  /**
   * Patches a user in the application.
   *
   * @breakingChange admin updateUser method signature changed to the new params/response format
   */
  public updateUser(params: IUpdateUserParams) {
    return this
      .handle(
        INVALID_PARAMETER,
        UNAUTHORIZED,
        FORBIDDEN,
        NOT_FOUND)
      .request<IUpdateUserResponse>({
          url: '/admin/users/{id}',
          method: 'PATCH',
          params: params
        }
      );
  }

  /**
   * Request to reindex the graph database. One may want to do it after editing the index configuration.
   *
   * @breakingChange admin startIndexation method signature changed to the new params/response format
   */
  public startIndexation(params: IStartIndexationParams) {
    return this
      .handle(
        UNAUTHORIZED,
        FORBIDDEN,
        NOT_FOUND)
      .request({
          url: '/:sourceKey/search/index',
          method: 'POST'
        }
      );
  }

  /**
   * Get the status of the Search API and return the indexing progress.
   *
   * @breakingChange admin getIndexationStatus method signature changed to the new params/response format
   */
  public getIndexationStatus(params: IGetIndexationStatusParams) {
    return this
      .handle(
        UNAUTHORIZED,
        FORBIDDEN,
        NOT_FOUND)
      .request<IGetIndexationStatusResponse>({
          url: '/:sourceKey/search/status',
          method: 'GET',
          params: params
        }
      );
  }

  // @breakingChange remove process indexation method


  // @breakingChange removed method checkIndexation in Admin module
  // @breakingCahnge removed method listenIndexation from Admin module
}
