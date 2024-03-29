/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';
import {IDataSourceParams, PaginatedResponse} from '../commonTypes';

import {
  IGetVisualizationParams,
  ICreateVisualizationParams,
  IDuplicateVisualizationParams,
  DuplicateVisualizationResponse,
  IDeleteVisualizationParams,
  IUpdateVisualizationParams,
  GetSharedVisualizationsResponse,
  ICreateVisualizationFolderParams,
  IUpdateVisualizationFolderParams,
  IDeleteVisualizationFolderParams,
  IGetVisualizationTreeParams,
  VisualizationTree,
  IGetSandboxParams,
  IUpdateSandboxParams,
  IGetVisualizationSharesParams,
  GetVisualizationSharesResponse,
  IShareVisualizationParams,
  IUnshareVisualizationParams,
  IGetWidgetParams,
  ICreateWidgetParams,
  IUpdateWidgetParams,
  IDeleteWidgetParams,
  VisualizationShare,
  Visualization,
  VisualizationFolder,
  Widget,
  PopulatedVisualization,
  IShareWithMultipleUsersParams,
  ReleaseVisualizationEditLockParams,
  VisualizationComment,
  CreateVisualizationCommentParams,
  GetVisualizationCommentsParams,
  DeleteVisualizationCommentParams
} from './types';

export * from './types';

const {
  UNAUTHORIZED,
  DATA_SOURCE_UNAVAILABLE,
  GUEST_DISABLED,
  NOT_FOUND,
  FOLDER_DELETION_FAILED,
  ALREADY_EXISTS,
  VISUALIZATION_LOCKED,
  INVALID_PARENT_FOLDER,
  FORBIDDEN
} = LkErrorKey;

export class VisualizationAPI extends Request {
  /**
   * Get the number of visualizations for the current user in this data-source.
   */
  public getVisualizationCount(this: Request<number>, params?: IDataSourceParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED],
      url: '/:sourceKey/visualizations/count',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get a visualization by id.
   */
  public getVisualization(this: Request<PopulatedVisualization>, params: IGetVisualizationParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND],
      url: '/:sourceKey/visualizations/:id',
      method: 'GET',
      params: params
    });
  }

  /**
   * Release the exclusive edit lock on a visualization.
   */
  public releaseEditLock(params: ReleaseVisualizationEditLockParams) {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      // sendBeacon() is supported in the browser
      return this.sendBeacon({
        errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND],
        url: '/:sourceKey/visualizations/:id/release-edit-lock',
        method: 'POST',
        params: params
      });
    } else {
      // sendBeacon() is not supported in the browser, or we are not in a browser environment
      return this.request({
        errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND],
        url: '/:sourceKey/visualizations/:id/release-edit-lock',
        method: 'POST',
        params: params
      });
    }
  }

  /**
   * Create a new visualization.
   */
  public createVisualization(this: Request<Visualization>, params: ICreateVisualizationParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND, INVALID_PARENT_FOLDER],
      url: '/:sourceKey/visualizations',
      method: 'POST',
      params: params
    });
  }

  /**
   * Duplicate a visualization. Return the id of the copy.
   */
  public duplicateVisualization(
    this: Request<DuplicateVisualizationResponse>,
    params: IDuplicateVisualizationParams
  ) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND],
      url: '/:sourceKey/visualizations/:id/duplicate',
      method: 'POST',
      params: params
    });
  }

  /**
   * Delete the visualization selected by id.
   */
  public deleteVisualization(params: IDeleteVisualizationParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND, VISUALIZATION_LOCKED],
      url: '/:sourceKey/visualizations/:id',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Update the visualization selected by id.
   */
  public updateVisualization(params: IUpdateVisualizationParams) {
    return this.request({
      errors: [
        UNAUTHORIZED,
        DATA_SOURCE_UNAVAILABLE,
        NOT_FOUND,
        VISUALIZATION_LOCKED,
        INVALID_PARENT_FOLDER
      ],
      url: '/:sourceKey/visualizations/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Get all visualizations shared with the current user.
   */
  public getSharedVisualizations(
    this: Request<GetSharedVisualizationsResponse>,
    params?: IDataSourceParams
  ) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE],
      url: '/:sourceKey/visualizations/shared',
      method: 'GET',
      params: params
    });
  }

  /**
   * Create a visualization folder.
   */
  public createVisualizationFolder(
    this: Request<VisualizationFolder>,
    params: ICreateVisualizationFolderParams
  ) {
    return this.request({
      errors: [
        UNAUTHORIZED,
        DATA_SOURCE_UNAVAILABLE,
        ALREADY_EXISTS,
        NOT_FOUND,
        INVALID_PARENT_FOLDER
      ],
      url: '/:sourceKey/visualizations/folder',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update a visualization folder.
   */
  public updateVisualizationFolder(
    this: Request<VisualizationFolder>,
    params: IUpdateVisualizationFolderParams
  ) {
    return this.request({
      errors: [
        UNAUTHORIZED,
        DATA_SOURCE_UNAVAILABLE,
        NOT_FOUND,
        ALREADY_EXISTS,
        INVALID_PARENT_FOLDER
      ],
      url: '/:sourceKey/visualizations/folder/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Delete a visualization folder.
   */
  public deleteVisualizationFolder(params: IDeleteVisualizationFolderParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND, FOLDER_DELETION_FAILED],
      url: '/:sourceKey/visualizations/folder/:id',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Get the visualizations and the visualization folders in a tree structure.
   */
  public getVisualizationTree(
    this: Request<VisualizationTree>,
    params?: IGetVisualizationTreeParams
  ) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND],
      url: '/:sourceKey/visualizations/tree',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get the visualization sandbox of the current user for a given data-source.
   */
  public getSandbox(this: Request<PopulatedVisualization>, params?: IGetSandboxParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED, NOT_FOUND],
      url: '/:sourceKey/sandbox',
      method: 'GET',
      params: params
    });
  }

  /**
   * Update the sandbox of the current user for a given data-source.
   */
  public updateSandbox(params: IUpdateSandboxParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE],
      url: '/:sourceKey/sandbox',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Get all share rights on a visualization.
   */
  public getVisualizationShares(
    this: Request<GetVisualizationSharesResponse>,
    params: IGetVisualizationSharesParams
  ) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND],
      url: '/:sourceKey/visualizations/:id/shares',
      method: 'GET',
      params: params
    });
  }

  /**
   * Set the share right of a user on a visualization.
   */
  public shareVisualization(this: Request<VisualizationShare>, params: IShareVisualizationParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND],
      url: `/:sourceKey/visualizations/:id/share/:userId`,
      method: 'PUT',
      params: params
    });
  }

  /**
   * Update the list of users and access level a visualization is shared with.
   */
  public shareWithMultipleUsers(
    this: Request<VisualizationShare>,
    params: IShareWithMultipleUsersParams
  ) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND],
      url: `/:sourceKey/visualizations/:id/share`,
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Remove a share right of a user on a visualization.
   */
  public unshareVisualization(params: IUnshareVisualizationParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND],
      url: `/:sourceKey/visualizations/:id/share/:userId`,
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Get a visualization widget's data by key.
   */
  public getWidget(this: Request<Widget>, params: IGetWidgetParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND],
      url: '/widget/:widgetKey',
      method: 'GET',
      params: params
    });
  }

  /**
   * Create a widget for a visualization. Return the widget key.
   */
  public createWidget(this: Request<string>, params: ICreateWidgetParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE],
      url: '/widget',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update the widget of a visualization. Return the widget key.
   */
  public updateWidget(this: Request<string>, params: IUpdateWidgetParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND],
      url: '/widget',
      method: 'PUT',
      params: params
    });
  }

  /**
   * Delete the widget of a visualization.
   */
  public deleteWidget(params: IDeleteWidgetParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND],
      url: '/widget/:widgetKey',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Create a visualization comment.
   */
  createVisualizationComment(
    this: Request<VisualizationComment>,
    params: CreateVisualizationCommentParams
  ) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND],
      url: '/:sourceKey/visualizations/:visualizationId/comments',
      method: 'POST',
      params: params
    });
  }

  /**
   * Get the visualization comment(s).
   */
  getVisualizationComments(
    this: Request<PaginatedResponse<VisualizationComment>>,
    params: GetVisualizationCommentsParams
  ) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND],
      url: '/:sourceKey/visualizations/:visualizationId/comments',
      method: 'GET',
      params: params
    });
  }

  /**
   * Delete visualization comment
   */
  deleteVisualizationComment(params: DeleteVisualizationCommentParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND, FORBIDDEN],
      url: '/:sourceKey/visualizations/comments/:commentId',
      method: 'DELETE',
      params: params
    });
  }
}
