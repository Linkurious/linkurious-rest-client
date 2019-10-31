/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';
import {IDataSourceParams} from '../commonTypes';

import {
  ICreateVisualizationFolderParams,
  CreateVisualizationFolderResponse,
  ICreateVisualizationParams,
  ICreateWidgetParams,
  IDeleteFolderParams,
  IDeleteVisualizationParams,
  IDeleteWidgetParams,
  IDuplicateVisualizationParams,
  DuplicateVisualizationResponse,
  IGetVisualizationByIdParams,
  IGetVisualizationSandboxParams,
  IGetVisualizationSharesParams,
  IGetWidgetParams,
  GetWidgetResponse,
  SharedVisualization,
  IShareVisualizationParams,
  IUnshareVisualizationParams,
  IUpdateSandboxParams,
  IUpdateVisualizationFolderParams,
  IUpdateVisualizationParams,
  IUpdateWidgetParams,
  VisualizationResponse,
  VisualizationShare,
  VisualizationShares,
  GetVisualizationTreeResponse
} from './types';

export * from './types';

const {UNAUTHORIZED, FORBIDDEN, NOT_FOUND} = LkErrorKey;

export class VisualizationAPI extends Request {
  public async updateVisualizationFolder(params: IUpdateVisualizationFolderParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, NOT_FOUND).request({
      url: '/:sourceKey/visualizations/folder/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Get shared visualizations.
   */
  public getShared(params: IDataSourceParams) {
    return this.handle().request<SharedVisualization[]>({
      url: '/:sourceKey/visualizations/shared',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get the number of visualizations for the current user in this data-source.
   *
   * @breakingChange update the server api to return number
   */
  public count(params: IDataSourceParams) {
    return this.handle().request<number>({
      url: '/:sourceKey/visualizations/count',
      method: 'GET',
      params: params
    });
  }

  /**
   * Create a widget for a visualization.
   */
  public createWidget(params: ICreateWidgetParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request<string>({
      url: '/widget',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update a widget for a visualization.
   */
  public updateWidget(params: IUpdateWidgetParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, NOT_FOUND).request<string>({
      url: '/widget',
      method: 'PUT',
      params: params
    });
  }

  /**
   * Create a folder for visualizations.
   *
   * @breakingChange update the server api to return the folder directly
   */
  public createFolder(params: ICreateVisualizationFolderParams) {
    return this.handle(UNAUTHORIZED).request<CreateVisualizationFolderResponse>({
      url: '/:sourceKey/visualizations/folder',
      method: 'POST',
      params: params
    });
  }

  /**
   * Create a new visualization.
   */
  public create(params: ICreateVisualizationParams) {
    return this.handle(UNAUTHORIZED).request<VisualizationResponse>({
      url: '/:sourceKey/visualizations',
      method: 'POST',
      params: params
    });
  }

  /**
   * Delete a widget for a visualization.
   */
  public deleteWidget(params: IDeleteWidgetParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request({
      url: '/widget/:id',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Remove the specified folder and its children (visualizations and sub-folders).
   */
  public deleteFolder(params: IDeleteFolderParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request({
      url: '/:sourceKey/visualizations/folder/:id',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Duplicates a visualization.
   */
  public duplicate(params: IDuplicateVisualizationParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request<DuplicateVisualizationResponse>({
      url: '/:sourceKey/visualizations/:id/duplicate',
      method: 'POST',
      params: params
    });
  }

  /**
   * Get a visualization widget's data by key.
   */
  public getWidget(params: IGetWidgetParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request<GetWidgetResponse>({
      url: '/widget/:id',
      method: 'GET',
      params: params
    });
  }

  /**
   * Return the visualization sandbox of the current user for a given data-source.
   */
  public getSandbox(params: IGetVisualizationSandboxParams) {
    return this.handle(UNAUTHORIZED).request<VisualizationResponse>({
      url: '/:sourceKey/sandbox',
      method: 'GET',
      params: params
    });
  }

  /**
   * Return one visualizations selected by ID.
   */
  public getOne(params: IGetVisualizationByIdParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request<VisualizationResponse>({
      url: '/:sourceKey/visualizations/:id',
      method: 'GET',
      params: params
    });
  }

  /**
   * Return visualizations ordered with folders hierarchy.
   *
   * @breakingChange update the server api to return the tree directly
   */
  public getTree(params: IDataSourceParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request<GetVisualizationTreeResponse[]>({
      url: '/:sourceKey/visualizations/tree',
      method: 'GET',
      params: params
    });
  }

  /**
   * Remove visualization selected by id.
   */
  public deleteOne(params: IDeleteVisualizationParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, NOT_FOUND).request({
      url: '/:sourceKey/visualizations/:id',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Get all share rights on a visualization.
   */
  public getShares(params: IGetVisualizationSharesParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request<VisualizationShares>({
      url: '/:sourceKey/visualizations/:id/shares',
      method: 'GET',
      params: params
    });
  }

  /**
   * Set the share right of a user on a visualization.
   */
  public share(params: IShareVisualizationParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request<VisualizationShare>({
      url: `/:sourceKey/visualizations/:vizId/share/:userId`,
      method: 'PUT',
      params: params
    });
  }

  /**
   * Remove a share right of a user on a visualization.
   */
  public unshare(params: IUnshareVisualizationParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request({
      url: `/:sourceKey/visualizations/:id/share/:userId`,
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Update the sandbox of the current user for a given data-source.
   */
  public updateSandbox(params: IUpdateSandboxParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request({
      url: '/:sourceKey/sandbox',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Update visualization selected by id.
   */
  public update(params: IUpdateVisualizationParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request({
      url: '/:sourceKey/visualizations/:id',
      method: 'PATCH',
      params: params
    });
  }
}
