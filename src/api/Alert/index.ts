/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';
import {IDataSourceParams} from '../commonTypes';

import {
  AlertTree,
  ICreateAlertFolderParams,
  ICreateAlertParams,
  IDeleteAlertFolderParams,
  IDeleteAlertParams,
  IDoCaseActionParams,
  IGetAlertParams,
  IGetCaseActionsParams,
  IGetCasesParams,
  IGetCaseParams,
  IUpdateAlertFolderParams,
  IUpdateAlertParams,
  AlertPreview,
  IAlertPreviewParams,
  Alert,
  AlertFolder,
  CaseAction,
  GetCasesResponse,
  IDeleteCaseCommentParams,
  IGetCaseActionsResponse,
  IUpdateCaseParams,
  PopulatedCase,
  IAssignCasesParams,
  ISearchAlertUsersParams,
  ISearchAlertUsersResponse
} from './types';

export * from './types';

const {
  INVALID_PARAMETER,
  FEATURE_DISABLED,
  UNAUTHORIZED,
  DATA_SOURCE_UNAVAILABLE,
  FORBIDDEN,
  NOT_FOUND,
  BAD_GRAPH_REQUEST,
  GRAPH_REQUEST_TIMEOUT,
  CONSTRAINT_VIOLATION,
  FOLDER_DELETION_FAILED,
  ALREADY_EXISTS,
  INVALID_ALERT_QUERY,
  INVALID_ALERT_TARGET,
  REDUNDANT_ACTION
} = LkErrorKey;

export class AlertAPI extends Request {
  /**
   * Create a new alert. If `caseTTL` is set to 0, unconfirmed cases
   * will disappear when they stop matching the alert query.
   */
  public createAlert(this: Request<Alert>, params: ICreateAlertParams) {
    return this.request({
      errors: [FEATURE_DISABLED, UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN],
      url: '/admin/:sourceKey/alerts',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update the alert selected by id.
   * Updating an alert query will results in all the previous detected cases deleted.
   */
  public updateAlert(this: Request<Alert>, params: IUpdateAlertParams) {
    return this.request({
      errors: [FEATURE_DISABLED, UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND],
      url: '/admin/:sourceKey/alerts/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Delete the alert by id and all its cases.
   */
  public deleteAlert(params: IDeleteAlertParams) {
    return this.request({
      errors: [FEATURE_DISABLED, UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND],
      url: '/admin/:sourceKey/alerts/:id',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Create an alert folder.
   */
  public createAlertFolder(this: Request<AlertFolder>, params: ICreateAlertFolderParams) {
    return this.request({
      errors: [FEATURE_DISABLED, UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, ALREADY_EXISTS],
      url: '/admin/:sourceKey/alerts/folder',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update an alert folder.
   */
  public updateAlertFolder(this: Request<AlertFolder>, params: IUpdateAlertFolderParams) {
    return this.request({
      errors: [
        FEATURE_DISABLED,
        UNAUTHORIZED,
        DATA_SOURCE_UNAVAILABLE,
        FORBIDDEN,
        NOT_FOUND,
        ALREADY_EXISTS
      ],
      url: '/admin/:sourceKey/alerts/folder/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Delete an alert folder.
   */
  public deleteAlertFolder(params: IDeleteAlertFolderParams) {
    return this.request({
      errors: [
        FEATURE_DISABLED,
        UNAUTHORIZED,
        DATA_SOURCE_UNAVAILABLE,
        FORBIDDEN,
        NOT_FOUND,
        FOLDER_DELETION_FAILED
      ],
      url: '/admin/:sourceKey/alerts/folder/:id',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Get the alerts and the alert folders in a tree structure.
   */
  public getAlertTree(this: Request<AlertTree>, params?: IDataSourceParams) {
    return this.request({
      errors: [FEATURE_DISABLED, UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN],
      url: '/:sourceKey/alerts/tree',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get an alert by id.
   */
  public getAlert(this: Request<Alert>, params: IGetAlertParams) {
    return this.request({
      errors: [FEATURE_DISABLED, UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND],
      url: '/:sourceKey/alerts/:id',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get a case by id.
   */
  public getCase(this: Request<PopulatedCase>, params: IGetCaseParams) {
    return this.request({
      errors: [FEATURE_DISABLED, UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND],
      url: '/:sourceKey/alerts/:alertId/cases/:caseId',
      method: 'GET',
      params: params
    });
  }

  /**
   * Update a case.
   */
  public updateCase(params: IUpdateCaseParams) {
    return this.request({
      errors: [FEATURE_DISABLED, UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND],
      url: '/:sourceKey/alerts/:alertId/cases/:caseId',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Assign one or more cases to a user.
   */
  public assignCases(params: IAssignCasesParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND],
      url: '/:sourceKey/alerts/:alertId/cases/assignments',
      method: 'POST',
      params: params
    });
  }

  /**
   * Search and filter all the users that can process a given alert.
   */
  public searchAlertUsersParams(this: Request<ISearchAlertUsersResponse>, params: ISearchAlertUsersParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND],
      url: '/:sourceKey/alerts/:alertId/users',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get all the cases of an alert.
   */
  public getCases(this: Request<GetCasesResponse>, params: IGetCasesParams) {
    return this.request({
      errors: [FEATURE_DISABLED, UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND],
      url: '/:sourceKey/alerts/:alertId/cases',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get all the actions of a case ordered by creation date. Recent ones first.
   * The offset defaults to 0 and the limit defaults to 10.
   */
  public getCaseActions(this: Request<IGetCaseActionsResponse>, params: IGetCaseActionsParams) {
    return this.request({
      errors: [FEATURE_DISABLED, UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND],
      url: '/:sourceKey/alerts/:alertId/cases/:caseId/actions',
      method: 'GET',
      params: params
    });
  }

  /**
   * Delete a comment on a case if the user that triggered the deletion is the author.
   */
  public deleteCaseComment(params: IDeleteCaseCommentParams) {
    return this.request({
      errors: [FEATURE_DISABLED, UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND],
      url: '/:sourceKey/alert/case/comment/:commentId',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Do an action (open, dismiss, confirm, comment) on a case.
   */
  public doCaseAction(this: Request<CaseAction>, params: IDoCaseActionParams) {
    return this.request({
      errors: [
        FEATURE_DISABLED,
        UNAUTHORIZED,
        DATA_SOURCE_UNAVAILABLE,
        FORBIDDEN,
        NOT_FOUND,
        REDUNDANT_ACTION
      ],
      url: '/:sourceKey/alerts/:alertId/cases/:caseId/action',
      method: 'POST',
      params: params
    });
  }

  /**
   * Get all the nodes and edges matching the given graph query.
   * An array of subgraphs, one for each subgraph matching the graph query, is returned.
   */
  public alertPreview(this: Request<AlertPreview>, params: IAlertPreviewParams) {
    return this.request({
      errors: [
        INVALID_PARAMETER,
        FEATURE_DISABLED,
        UNAUTHORIZED,
        DATA_SOURCE_UNAVAILABLE,
        FORBIDDEN,
        BAD_GRAPH_REQUEST,
        GRAPH_REQUEST_TIMEOUT,
        CONSTRAINT_VIOLATION,
        INVALID_ALERT_QUERY,
        INVALID_ALERT_TARGET
      ],
      url: '/:sourceKey/graph/alertPreview',
      method: 'POST',
      params: params
    });
  }
}
