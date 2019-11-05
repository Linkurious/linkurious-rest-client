/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';

import {
  IGetVisualizationCountParams,
  IGetVisualizationParams,
  ICreateVisualizationParams,
  IDuplicateVisualizationParams,
  DuplicateVisualizationResponse,
  IDeleteVisualizationParams,
  IUpdateVisualizationParams,
  IGetSharedVisualizationsParams,
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
  Widget
} from './types';

export * from './types';

const {UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED, NOT_FOUND} = LkErrorKey;

export class VisualizationAPI extends Request {
  /**
   * Get the number of visualizations for the current user in this data-source.
   */
  public getVisualizationCount(params?: IGetVisualizationCountParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED).request<number>({
      url: '/:sourceKey/visualizations/count',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get a visualization by id.
   */
  public getVisualization(params: IGetVisualizationParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND).request<Visualization>({
      url: '/:sourceKey/visualizations/:id',
      method: 'GET',
      params: params
    });
  }

  /**
   * Create a new visualization.
   */
  public createVisualization(params: ICreateVisualizationParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE).request<Visualization>({
      url: '/:sourceKey/visualizations',
      method: 'POST',
      params: params
    });
  }

  /**
   * Duplicate a visualization. Return the id of the copy.
   */
  public duplicateVisualization(params: IDuplicateVisualizationParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND).request<
      DuplicateVisualizationResponse
    >({
      url: '/:sourceKey/visualizations/:id/duplicate',
      method: 'POST',
      params: params
    });
  }

  /**
   * Delete the visualization selected by id.
   */
  public deleteVisualization(params: IDeleteVisualizationParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND).request({
      url: '/:sourceKey/visualizations/:id',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Update the visualization selected by id.
   */
  public updateVisualization(params: IUpdateVisualizationParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND).request({
      url: '/:sourceKey/visualizations/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Get all visualizations shared with the current user.
   */
  public getSharedVisualizations(params?: IGetSharedVisualizationsParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE).request<
      GetSharedVisualizationsResponse
    >({
      url: '/:sourceKey/visualizations/shared',
      method: 'GET',
      params: params
    });
  }

  /**
   * Create a visualization folder.
   */
  public createVisualizationFolder(params: ICreateVisualizationFolderParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE).request<VisualizationFolder>({
      url: '/:sourceKey/visualizations/folder',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update a visualization folder.
   */
  public async updateVisualizationFolder(params: IUpdateVisualizationFolderParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND).request<
      VisualizationFolder
    >({
      url: '/:sourceKey/visualizations/folder/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Delete a visualization folder.
   */
  public deleteVisualizationFolder(params: IDeleteVisualizationFolderParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND).request({
      url: '/:sourceKey/visualizations/folder/:id',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Get the visualizations and the visualization folders in a tree structure.
   */
  public getVisualizationTree(params?: IGetVisualizationTreeParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE).request<VisualizationTree>({
      url: '/:sourceKey/visualizations/tree',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get the visualization sandbox of the current user for a given data-source.
   */
  public getSandbox(params: IGetSandboxParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED).request<
      Visualization
    >({
      url: '/:sourceKey/sandbox',
      method: 'GET',
      params: params
    });
  }

  /**
   * Update the sandbox of the current user for a given data-source.
   */
  public updateSandbox(params: IUpdateSandboxParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE).request({
      url: '/:sourceKey/sandbox',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Get all share rights on a visualization.
   */
  public getVisualizationShares(params: IGetVisualizationSharesParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND).request<
      GetVisualizationSharesResponse
    >({
      url: '/:sourceKey/visualizations/:id/shares',
      method: 'GET',
      params: params
    });
  }

  /**
   * Set the share right of a user on a visualization.
   */
  public shareVisualization(params: IShareVisualizationParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND).request<
      VisualizationShare
    >({
      url: `/:sourceKey/visualizations/:visualizationId/share/:userId`,
      method: 'PUT',
      params: params
    });
  }

  /**
   * Remove a share right of a user on a visualization.
   */
  public unshareVisualization(params: IUnshareVisualizationParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND).request({
      url: `/:sourceKey/visualizations/:id/share/:userId`,
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Get a visualization widget's data by key.
   */
  public getWidget(params: IGetWidgetParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND).request<Widget>({
      url: '/widget/:widgetKey',
      method: 'GET',
      params: params
    });
  }

  /**
   * Create a widget for a visualization. Return the widget key.
   */
  public createWidget(params: ICreateWidgetParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE).request<string>({
      url: '/widget',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update the widget of a visualization. Return the widget key.
   */
  public updateWidget(params: IUpdateWidgetParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND).request<string>({
      url: '/widget',
      method: 'PUT',
      params: params
    });
  }

  /**
   * Delete the widget of a visualization.
   */
  public deleteWidget(params: IDeleteWidgetParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND).request({
      url: '/widget/:widgetKey',
      method: 'DELETE',
      params: params
    });
  }
}
