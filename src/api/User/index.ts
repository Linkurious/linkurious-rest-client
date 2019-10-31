/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {LkErrorKey} from '../../http/response';
import {Request} from '../../http/request';
import {IMergeVisualizationsParams} from '../Visualization/types';

import {
  GroupName,
  ICreateGroupParams,
  ICreateUserParams,
  ICreateUserResponse,
  IDeleteAccessRightsParams,
  IDeleteGroupParams,
  IDeleteUserParams,
  IGetGroupNamesParams,
  IGetGroupParams,
  GroupRights,
  IGetGroupsParams,
  ISetGroupAccessRightsParams,
  SystemGroup,
  IUpdateGroupParams,
  IUpdateUserParams,
  IUpdateUserResponse,
  IFullUser,
  IGetUserParams,
  ISearchUsersParams
} from './types';

const {UNAUTHORIZED, FORBIDDEN, NOT_FOUND, DATA_SOURCE_UNAVAILABLE, GROUP_EXISTS} = LkErrorKey;

export class UserAPI extends Request {
  /**
   * Get a user by id.
   */
  public getUser(params: IGetUserParams) {
    return this.handle(UNAUTHORIZED, NOT_FOUND).request<IFullUser>({
      url: '/admin/users/:id',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get the list of users.
   */
  public getUsers(params: ISearchUsersParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request<IFullUser[]>({
      url: '/users',
      method: 'GET',
      params: params
    });
  }

  /**
   * Add a new user to the application.
   */
  public createUser(params: ICreateUserParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request<ICreateUserResponse>({
      url: '/admin/users',
      method: 'POST',
      params: params
    });
  }

  /**
   * Patches a user in the application.
   */
  public updateUser(params: IUpdateUserParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, NOT_FOUND).request<IUpdateUserResponse>({
      url: '/admin/users/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Deletes a user in the application.
   *
   * @breakingChange response type is now void instead of boolean
   */
  public deleteUser(params: IDeleteUserParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request<void>({
      url: '/admin/users/:id',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Get a group already defined in the database.
   */
  public getGroup(params: IGetGroupParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, NOT_FOUND).request<SystemGroup>({
      url: '/admin/:sourceKey/groups/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * List all the groups for the current source.
   */
  public getGroups(params: IGetGroupsParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request<SystemGroup[]>({
      url: '/admin/:sourceKey/groups',
      method: 'GET',
      params: params
    });
  }

  /**
   * List all the available groups for the current source.
   */
  public getGroupNames(params: IGetGroupNamesParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request<GroupName[]>({
      url: '/:sourceKey/groups',
      method: 'GET',
      params: params
    });
  }

  /**
   * Adds a new group to the application.
   */
  public createGroup(params: ICreateGroupParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE, GROUP_EXISTS).request<
      SystemGroup
    >({
      url: '/admin/:sourceKey/groups',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update a group (only name).
   */
  public renameGroup(params: IUpdateGroupParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, NOT_FOUND).request<void>({
      url: '/admin/:sourceKey/groups/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Deletes a group in the application.
   */
  public deleteGroup(params: IDeleteGroupParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, NOT_FOUND).request<void>({
      url: '/admin/:sourceKey/groups/:id',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Get possible targetType, type and action names.
   */
  public getAccessRightsInfo() {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request<GroupRights[]>({
      url: '/admin/groups/rights_info',
      method: 'GET'
    });
  }

  /**
   * set access rights for a group.
   */
  public putAccessRights(params: ISetGroupAccessRightsParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, NOT_FOUND).request<void>({
      url: '/admin/:sourceKey/groups/:id/access_rights',
      method: 'PUT',
      params: params
    });
  }

  /**
   * Delete access right.
   */
  public deleteAccessRights(params: IDeleteAccessRightsParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, NOT_FOUND).request<void>({
      url: '/admin/:sourceKey/groups/:id/access_rights',
      method: 'DELETE',
      params: params
    });
  }

  public mergeVisualizations(params: IMergeVisualizationsParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request<void>({
      url: '/admin/users/mergeVisualizations',
      method: 'POST',
      params: params
    });
  }
}