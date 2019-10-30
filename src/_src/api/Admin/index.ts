/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-29.
 */
import {
  ICreateUserParams,
  ICreateUserResponse,
  IDeleteUserParams,
  GroupRights,
  ISetGroupAccessRightsParams,
  IUpdateUserParams,
  IUpdateUserResponse,
  IStartIndexationParams,
  IGetIndexationStatusParams,
  IGetIndexationStatusResponse,
  ICreateAlertResponse,
  ICreateAlertParams,
  IUpdateAlertParams,
  IUpdateAlertResponse, IDeleteAlertParams
} from './types';
import { Request } from '../../http/request';
import { LkErrorKey } from '../../http/response';

const {INVALID_PARAMETER, UNAUTHORIZED, FORBIDDEN, NOT_FOUND} = LkErrorKey;

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
   * Get possible targetType, type and action names.
   */
  public getGroupsRights() {
    return this
      .handle(
        UNAUTHORIZED,
        FORBIDDEN)
      .request<GroupRights[]>({
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
  /**
   * Create and return new alert.
   */
  public createAlert(params: ICreateAlertParams) {
    return this
      .handle(
        INVALID_PARAMETER,
        UNAUTHORIZED,
        FORBIDDEN)
      .request<ICreateAlertResponse>({
          url: '/admin/:sourceKey/alerts',
          method: 'POST',
          params: params
        }
      );
  }

  /**
   * update existing alert.
   *
   * @breakingChange admin updateAlert method signature changed to the new params/response format
   */
  public updateAlert(params: IUpdateAlertParams) {
    return this
      .handle(
        INVALID_PARAMETER,
        UNAUTHORIZED,
        FORBIDDEN,
        NOT_FOUND)
      .request<IUpdateAlertResponse>({
          url: '/admin/:sourceKey/alerts/:id',
          method: 'PATCH',
          params: params
        }
      );
  }

  /**
   * Delete existing alert.
   *
   * @breakingChange admin deleteAlert method signature changed to the new params/response format
   * @breakingChange admin deleteAlert response changed from boolean to void
   */
  public deleteAlert(params: IDeleteAlertParams) {
    return this
      .handle(
        INVALID_PARAMETER,
        UNAUTHORIZED,
        FORBIDDEN,
        NOT_FOUND)
      .request({
          url: '/admin/:sourceKey/alerts/:id',
          method: 'DELETE',
          params: params
        }
      );
  }

  // @breakingChange removed method checkIndexation in Admin module
  // @breakingCahnge removed method listenIndexation from Admin module
}
