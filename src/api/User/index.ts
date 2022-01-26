/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {LkErrorKey} from '../../http/response';
import {Request} from '../../http/request';
import {IDataSourceParams} from '../commonTypes';

import {
  Group,
  GroupName,
  ICreateGroupParams,
  ICreateUserParams,
  IDeleteGroupParams,
  IDeleteUserParams,
  IGetGroupNamesParams,
  IGetGroupParams,
  IGetUserParams,
  IMergeUsersParams,
  ISearchUsersParams,
  IUpdateGroupParams,
  IUpdateUserParams,
  SearchUserResponse,
  User
} from './types';

export * from './types';

const {
  UNAUTHORIZED,
  DATA_SOURCE_UNAVAILABLE,
  FORBIDDEN,
  NOT_FOUND,
  ALREADY_EXISTS,
  INVALID_PARAMETER
} = LkErrorKey;

export class UserAPI extends Request {
  /**
   * Get a user by id.
   */
  public getUser(this: Request<User>, params: IGetUserParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, NOT_FOUND],
      url: '/admin/users/:id',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get all the users or filter them by username, e-mail or group id.
   */
  public searchUsers(this: Request<SearchUserResponse>, params: ISearchUsersParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE],
      url: '/users',
      method: 'GET',
      params: params
    });
  }

  /**
   * Add a new user.
   */
  public createUser(this: Request<User>, params: ICreateUserParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, ALREADY_EXISTS],
      url: '/admin/users',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update a user.
   */
  public updateUser(this: Request<User>, params: IUpdateUserParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, NOT_FOUND, INVALID_PARAMETER],
      url: '/admin/users/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Delete a user.
   */
  public deleteUser(params: IDeleteUserParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, NOT_FOUND],
      url: '/admin/users/:id',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Get a group.
   */
  public getGroup(this: Request<Group>, params: IGetGroupParams) {
    return this.request({
      errors: [DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND],
      url: '/admin/:sourceKey/groups/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Get all the groups within a data-source.
   */
  public getGroups(this: Request<Group[]>, params?: IDataSourceParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN],
      url: '/admin/:sourceKey/groups',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get the names of groups that can perform a given action on the data-source.
   */
  public getGroupNames(this: Request<GroupName[]>, params: IGetGroupNamesParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE],
      url: '/:sourceKey/groups',
      method: 'GET',
      params: params
    });
  }

  /**
   * Add a new group.
   */
  public createGroup(this: Request<Group>, params: ICreateGroupParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, ALREADY_EXISTS],
      url: '/admin/:sourceKey/groups',
      method: 'POST',
      params: params
    });
  }

  /**
   * Rename a group.
   */
  public updateGroup(this: Request<Group>, params: IUpdateGroupParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND],
      url: '/admin/:sourceKey/groups/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Delete a group.
   */
  public deleteGroup(params: IDeleteGroupParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND],
      url: '/admin/:sourceKey/groups/:id',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Transfer all the visualizations, queries and custom actions from a source user to a target user.
   */
  public mergeUsers(params: IMergeUsersParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN],
      url: '/admin/users/mergeUsers',
      method: 'POST',
      params: params
    });
  }
}
