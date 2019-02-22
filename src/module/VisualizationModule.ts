/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-05-30.
 *
 * File:
 * Description :
 */

'use strict';

import {
  IVisualization,
  IWidget,
  ITreeChildren,
  ISharers,
  IShare,
  IFolder,
  IFolderFullResponse,
  IWidgetContent,
  IVisualizationNode,
  IVisualizationEdge,
  IAlternativeIdConfig,
  IVisualizationLayout,
  IVisualizationGeo,
  IVisualizationDesign,
  IItemFields,
  PopulateType,
  VisualizationModeType,
  ISharedVisualization,
} from '../../index';
import { Module } from './Module';
import { Fetcher } from '../http/fetcher';
import { VisualizationParser } from './VisualizationParser';
import { Utils } from '../http/utils';
import { Success } from '../response/success';
import { Rejection } from '../response/errors';

export class VisualizationModule extends Module {
  constructor(fetcher: Fetcher) {
    super(fetcher);
  }

  /**
   * get shared visualizations
   *
   * @param {string}dataSourceKey
   * @returns {Promise<any>}
   */
  public getShared(dataSourceKey?: string): Promise<Success<Array<ISharedVisualization>> | Rejection> {
    return this.fetch({
      url: '/{dataSourceKey}/visualizations/shared',
      method: 'GET',
      dataSource: dataSourceKey,
    })
      .then((response: Array<ISharedVisualization>) => new Success(response))
      .catch((error) => new Rejection(error));
  }

  /**
   * Get the number of visualizations for the current user in this data-source.
   *
   * @param {string}dataSourceKey
   * @returns {Promise<number>}
   */
  public count(dataSourceKey?: string): Promise<Success<number> | Rejection> {
    return this.fetch({
      url: '/{dataSourceKey}/visualizations/count',
      method: 'GET',
      dataSource: dataSourceKey,
    })
      .then((response: { count: number }) => new Success(response.count))
      .catch((error) => new Rejection(error));
  }

  /**
   * Create a widget for a visualization.
   *
   * @param {Object} data
   * @returns {Promise<string>}
   */
  public createWidget(data: {
    visualizationId: number;
    content?: {
      search?: boolean;
      share?: boolean;
      layout?: boolean;
      fullscreen?: boolean;
      zoom?: boolean;
      legend?: boolean;
      geo?: boolean;
      password?: boolean;
    };
  }): Promise<Success<string> | Rejection> {
    return this.fetch({
      url: '/widget',
      method: 'POST',
      body: Utils.fixSnakeCase(data),
    })
      .then((response: string) => new Success(response))
      .catch((error) => new Rejection(error));
  }

  /**
   * Update a widget for a visualization.
   *
   * @param {Object} data
   * @returns {Promise<string>}
   */
  public updateWidget(data: {
    visualizationId: number;
    content: IWidgetContent;
  }): Promise<Success<string> | Rejection> {
    return this.fetch({
      url: '/widget',
      method: 'PUT',
      body: Utils.fixSnakeCase(data),
    })
      .then((response: string) => new Success(response))
      .catch((error) => new Rejection(error));
  }

  /**
   * Create a folder for visualizations
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<IFolder>}
   */
  public createFolder(
    data: {
      title: string;
      parent: number;
    },
    dataSourceKey?: string
  ): Promise<Success<IFolder> | Rejection> {
    return this.fetch({
      url: '/{dataSourceKey}/visualizations/folder',
      method: 'POST',
      body: data,
      dataSource: dataSourceKey,
    })
      .then((response: IFolderFullResponse) => new Success(response.folder))
      .catch((error) => new Rejection(error));
  }

  /**
   * Create a new visualization.
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<IVisualization>}
   */
  public create(
    data: {
      title: string;
      folder?: number;
      nodes: Array<IVisualizationNode>;
      edges: Array<IVisualizationEdge>;
      alternativeIds?: IAlternativeIdConfig;
      layout?: IVisualizationLayout;
      mode?: string;
      geo?: IVisualizationGeo;
      design?: IVisualizationDesign;
      filters?: Array<any>;
      nodeFields: IItemFields;
      edgeFields: IItemFields;
    },
    dataSourceKey?: string
  ): Promise<Success<IVisualization> | Rejection> {
    return this.fetch({
      url: '/{dataSourceKey}/visualizations',
      method: 'POST',
      body: data,
      dataSource: dataSourceKey,
    })
      .then((response: any) => new Success(VisualizationParser.formatVisualization(response.visualization)))
      .catch((error) => new Rejection(error));
  }

  /**
   * Delete a widget for a visualization.
   *
   * @param {Object} data
   * @returns {Promise<boolean>}
   */
  public deleteWidget(data: { id: string }): Promise<Success<boolean> | Rejection> {
    return this.fetch({
      url: '/widget/{id}',
      method: 'DELETE',
      query: data,
    })
      .then((response: boolean) => new Success(response))
      .catch((error) => new Rejection(error));
  }

  /**
   * Remove the specified folder and its children (visualizations and sub-folders)
   *
   * @param {Object} data
   * @param {string} dataSourceKey
   * @returns {Promise<boolean>}
   */
  public deleteFolder(
    data: {
      id: number;
    },
    dataSourceKey?: string
  ): Promise<Success<boolean> | Rejection> {
    return this.fetch({
      url: '/{dataSourceKey}/visualizations/folder/{id}',
      method: 'DELETE',
      query: data,
      dataSource: dataSourceKey,
    })
      .then((response: boolean) => new Success(response))
      .catch((error) => new Rejection(error));
  }

  /**
   * Duplicates a visualization.
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<{visualizationId:number}>}
   */
  public duplicate(
    data: {
      id: number;
      title?: string;
      folder?: number;
    },
    dataSourceKey?: string
  ): Promise<Success<{ visualizationId: number }> | Rejection> {
    return this.fetch({
      url: '/{dataSourceKey}/visualizations/{id}/duplicate',
      method: 'POST',
      body: data,
      dataSource: dataSourceKey,
    })
      .then((response: { visualizationId: number }) => new Success(response))
      .catch((error) => new Rejection(error));
  }

  /**
   * Get a visualization widget's data by key
   *
   * @param {Object} data
   * @returns {Promise<IWidget>}
   */
  public getWidget(data: { id: string }): Promise<Success<IWidget> | Rejection> {
    return this.fetch({
      url: '/widget/{id}',
      method: 'GET',
      query: data,
    })
      .then((response: IWidget) => new Success(response))
      .catch((error) => new Rejection(error));
  }

  /**
   * Return the visualization sandbox of the current user for a given data-source
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<IVisualization>}
   */
  public getSandbox(
    data?: {
      populate?: PopulateType;
      itemId?: number;
      searchQuery?: string;
      searchFuzziness?: number;
      doLayout?: boolean;
      patternDialect?: string;
      patternQuery?: boolean;
      withDigest?: boolean;
      withDegree?: boolean;
      matchId?: boolean;
    },
    dataSourceKey?: string
  ): Promise<Success<IVisualization> | Rejection> {
    return this.fetch({
      url: '/{dataSourceKey}/sandbox',
      method: 'GET',
      query: data,
      dataSource: dataSourceKey,
    })
      .then((response: any) => new Success(VisualizationParser.formatVisualization(response.visualization)))
      .catch((error) => new Rejection(error));
  }

  /**
   * Return one visualizations selected by ID.
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<IVisualization>}
   */
  public getOne(
    data: {
      id: number;
      populated?: boolean;
      withDigest?: boolean;
      withDegree?: boolean;
    },
    dataSourceKey?: string
  ): Promise<Success<IVisualization> | Rejection> {
    return this.fetch({
      url: '/{dataSourceKey}/visualizations/{id}',
      method: 'GET',
      query: data,
      dataSource: dataSourceKey,
    })
      .then((response: any) => new Success(VisualizationParser.formatVisualization(response.visualization)))
      .catch((error) => new Rejection(error));
  }

  /**
   * Return visualizations ordered with folders hierarchy.
   *
   * @param {string} dataSourceKey
   * @returns {Promise<ITreeChildren>}
   */
  public getTree(dataSourceKey?: string): Promise<Success<Array<ITreeChildren>> | Rejection> {
    return this.fetch({
      url: '/{dataSourceKey}/visualizations/tree',
      method: 'GET',
    })
      .then((response: { tree: Array<ITreeChildren> }) => new Success(response.tree))
      .catch((error) => new Rejection(error));
  }

  /**
   * Remove visualization selected by id.
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<boolean>}
   */
  public deleteOne(
    data: {
      id: number;
    },
    dataSourceKey?: string
  ): Promise<Success<void> | Rejection> {
    return this.fetch({
      url: '/{dataSourceKey}/visualizations/{id}',
      method: 'DELETE',
      query: data,
      dataSource: dataSourceKey,
    })
      .then(() => new Success(undefined))
      .catch((error) => new Rejection(error));
  }

  /**
   * Get all share rights on a visualization
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<ISharers>}
   */
  public getShares(
    data: {
      id: number;
    },
    dataSourceKey?: string
  ): Promise<Success<ISharers> | Rejection> {
    return this.fetch({
      url: '/{dataSourceKey}/visualizations/{id}/shares',
      method: 'GET',
      query: data,
      dataSource: dataSourceKey,
    })
      .then((response: ISharers) => new Success(response))
      .catch((error) => new Rejection(error));
  }

  /**
   * Set the share right of a user on a visualization
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<IShare>}
   */
  public share(
    data: {
      userId: number;
      right?: string;
      vizId: number;
    },
    dataSourceKey?: string
  ): Promise<Success<IShare> | Rejection> {
    return this.fetch({
      url: `/{dataSourceKey}/visualizations/${data.vizId}/share/${data.userId}`,
      method: 'PUT',
      body: {
        right: data.right,
      },
      dataSource: dataSourceKey,
    })
      .then((response: IShare) => new Success(response))
      .catch((error) => new Rejection(error));
  }

  /**
   * Remove a share right of a user on a visualization
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<boolean>}
   */
  public unshare(
    data: {
      id: number;
      userId: number;
    },
    dataSourceKey?: string
  ): Promise<Success<void> | Rejection> {
    return this.fetch({
      url: `/{dataSourceKey}/visualizations/{id}/share/${data.userId}`,
      method: 'DELETE',
      query: { id: data.id },
      dataSource: dataSourceKey,
    })
      .then(() => new Success(undefined))
      .catch((error) => new Rejection(error));
  }

  /**
   * Update a property of a folder
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<any>}
   */
  public updateFolder(
    data: {
      id: number;
      key: string;
      value: string;
    },
    dataSourceKey?: string
  ): Promise<Success<IFolder> | Rejection> {
    return this.fetch({
      url: '/{dataSourceKey}/visualizations/folder/{id}',
      method: 'PATCH',
      body: data,
      dataSource: dataSourceKey,
    })
      .then((response: { folder: IFolder }) => new Success(response.folder))
      .catch((error) => new Rejection(error));
  }

  /**
   * Update the sandbox of the current user for a given data-source.
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<boolean>}
   */
  public updateSandbox(
    data: {
      design?: IVisualizationDesign;
      nodeFields?: IItemFields;
      edgeFields?: IItemFields;
    },
    dataSourceKey?: string
  ): Promise<Success<string> | Rejection> {
    return this.fetch({
      url: '/{dataSourceKey}/sandbox',
      method: 'PATCH',
      body: { visualization: data },
      dataSource: dataSourceKey,
    })
      .then((response: string) => new Success(response))
      .catch((error) => new Rejection(error));
  }

  /**
   * Update visualization selected by id.
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<boolean>}
   */
  public update(
    data: {
      id: number;
      design?: IVisualizationDesign;
      nodeFields?: IItemFields;
      edgeFields?: IItemFields;
      title?: string;
      folder?: number;
      nodes?: Array<IVisualizationNode>;
      edges?: Array<IVisualizationEdge>;
      alternativeIds?: IAlternativeIdConfig;
      layout?: IVisualizationLayout;
      geo?: IVisualizationGeo;
      mode?: VisualizationModeType;
      filters?: Array<any>;
      forceLock?: boolean;
    },
    dataSourceKey?: string
  ): Promise<Success<void> | Rejection> {
    let vizBody: any = JSON.parse(JSON.stringify(data));
    vizBody.id = undefined;
    vizBody.forceLock = undefined;

    return this.fetch({
      url: '/{dataSourceKey}/visualizations/{id}',
      method: 'PATCH',
      body: { id: data.id, visualization: vizBody },
      query: Utils.fixSnakeCase({ forceLock: data.forceLock }),
    })
      .then(() => new Success(undefined))
      .catch((error) => new Rejection(error));
  }
}
