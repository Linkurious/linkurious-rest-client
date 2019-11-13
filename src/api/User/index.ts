/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {LkErrorKey} from '../../http/response';
import {Request} from '../../http/request';

import {
  Group,
  GroupName,
  ICreateGroupParams,
  ICreateUserParams,
  IDeleteGroupParams,
  IDeleteUserParams,
  IGetGroupNamesParams,
  IGetGroupParams,
  IGetGroupsParams,
  IGetUserParams,
  IMergeVisualizationsParams,
  ISearchUsersParams,
  ISetAccessRightsParams,
  IUpdateGroupParams,
  IUpdateUserParams,
  SearchUserResponse,
  User
} from './types';

export * from './types';

const {UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND, GROUP_EXISTS} = LkErrorKey;

export class UserAPI extends Request {
  /**
   * Get a user by id.
   */
  public getUser(params: IGetUserParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, NOT_FOUND).request<User>({
      url: '/admin/users/:id',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get all the users or filter them by username, e-mail or group id.
   */
  public searchUsers(params: ISearchUsersParams) {
    return this.handle(UNAUTHORIZED).request<SearchUserResponse>({
      url: 'c',
      method: 'GET',
      params: params
    });
  }

  /**
   * Add a new user.
   */
  public createUser(params: ICreateUserParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request<User>({
      url: '/admin/users',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update a user.
   */
  public updateUser(params: IUpdateUserParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, NOT_FOUND).request<User>({
      url: '/admin/users/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Delete a user.
   */
  public deleteUser(params: IDeleteUserParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, NOT_FOUND).request({
      url: '/admin/users/:id',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Get a group.
   */
  public getGroup(params: IGetGroupParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request<Group>({
      url: '/admin/:sourceKey/groups/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Get all the groups within a data-source.
   */
  public getGroups(params: IGetGroupsParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN).request<Group[]>({
      url: '/admin/:sourceKey/groups',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get the names of groups that can perform a given action on the data-source.
   */
  public getGroupNames(params: IGetGroupNamesParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE).request<GroupName[]>({
      url: '/:sourceKey/groups',
      method: 'GET',
      params: params
    });
  }

  /**
   * Add a new group.
   */
  public createGroup(params: ICreateGroupParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, GROUP_EXISTS).request<
      Group
    >({
      url: '/admin/:sourceKey/groups',
      method: 'POST',
      params: params
    });
  }

  /**
   * Rename a group.
   */
  public updateGroup(params: IUpdateGroupParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request<Group>({
      url: '/admin/:sourceKey/groups/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Delete a group.
   */
  public deleteGroup(params: IDeleteGroupParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request({
      url: '/admin/:sourceKey/groups/:id',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Set access rights on a group. The access rights will be checked to be of node categories or edge types in the schema.
   */
  public setAccessRights(params: ISetAccessRightsParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request({
      url: '/admin/:sourceKey/groups/:id/access_rights',
      method: 'PUT',
      params: params
    });
  }

  /**
   * Transfer all the visualizations from a source user to a target user.
   */
  public mergeVisualizations(params: IMergeVisualizationsParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request({
      url: '/admin/users/mergeVisualizations',
      method: 'POST',
      params: params
    });
  }
}
