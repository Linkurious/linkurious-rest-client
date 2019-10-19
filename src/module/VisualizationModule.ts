/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2016-05-30.
 */

// TODO TS2019

import {
  Forbidden,
  IAlternativeIdConfig,
  IVizFolder,
  IFolderFullResponse,
  IItemFields,
  InvalidParameter,
  IShare,
  ISharers,
  ITreeChildren,
  IVisualization,
  IVisualizationDesign,
  IVisualizationEdge,
  IVisualizationGeo,
  IVisualizationLayout,
  IVisualizationNode,
  IWidget,
  IWidgetContent,
  NotFound,
  PopulateType,
  Success,
  Unauthorized,
  VisualizationModeType
} from '../../index';
import {Utils} from '../http/utils';
import {
  IMergeVisualizationsParams,
  IUpdateVisualizationFolderParams
} from '../models/Visualization';

import {Module} from './Module';
import {VisualizationParser} from './VisualizationParser';

export class VisualizationModule extends Module {
  public async mergeVisualizations(
    options: IMergeVisualizationsParams
  ): Promise<Success<void> | Unauthorized | Forbidden> {
    return this.request({
      url: '/admin/users/mergeVisualizations',
      method: 'POST',
      body: options
    });
  }

  public async updateVisualizationFolder(
    options: IUpdateVisualizationFolderParams
  ): Promise<Success<void> | Unauthorized | Forbidden | NotFound | InvalidParameter> {
    return this.request({
      url: '/{sourceKey}/visualizations/folder/{id}',
      method: 'PATCH',
      body: options,
      path: {
        sourceKey: options.sourceKey,
        id: options.id
      }
    });
  }

  // TODO TS2019 refactor under here

  /**
   * get shared visualizations
   *
   * @param {string}dataSourceKey
   * @returns {Promise<any>}
   */
  public getShared(dataSourceKey?: string): Promise<IVisualization[]> {
    return this.fetch({
      url: '/{sourceKey}/visualizations/shared',
      method: 'GET',
      path: {sourceKey: dataSourceKey}
    });
  }

  /**
   * Get the number of visualizations for the current user in this data-source.
   *
   * @param {string}dataSourceKey
   * @returns {Promise<number>}
   */
  public count(dataSourceKey?: string): Promise<number> {
    return this.fetch({
      url: '/{sourceKey}/visualizations/count',
      method: 'GET',
      path: {sourceKey: dataSourceKey}
    }).then((r: any) => r.count);
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
  }): Promise<string> {
    return this.fetch({
      url: '/widget',
      method: 'POST',
      body: Utils.fixSnakeCase(data)
    });
  }

  /**
   * Update a widget for a visualization.
   *
   * @param {Object} data
   * @returns {Promise<string>}
   */
  public updateWidget(data: {visualizationId: number; content: IWidgetContent}): Promise<string> {
    return this.fetch({
      url: '/widget',
      method: 'PUT',
      body: Utils.fixSnakeCase(data)
    });
  }

  /**
   * Create a folder for visualizations
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<IVizFolder>}
   */
  public createFolder(
    data: {
      title: string;
      parent: number;
    },
    dataSourceKey?: string
  ): Promise<IVizFolder> {
    return this.fetch({
      url: '/{sourceKey}/visualizations/folder',
      method: 'POST',
      body: data,
      path: {sourceKey: dataSourceKey}
    }).then((res: IFolderFullResponse) => res.folder);
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
      nodes: IVisualizationNode[];
      edges: IVisualizationEdge[];
      alternativeIds?: IAlternativeIdConfig;
      layout?: IVisualizationLayout;
      mode?: string;
      geo?: IVisualizationGeo;
      design?: IVisualizationDesign;
      filters?: any[];
      nodeFields: IItemFields;
      edgeFields: IItemFields;
    },
    dataSourceKey?: string
  ): Promise<IVisualization> {
    return this.fetch({
      url: '/{sourceKey}/visualizations',
      method: 'POST',
      body: data,
      path: {sourceKey: dataSourceKey}
    }).then((res: any) => VisualizationParser.formatVisualization(res.visualization));
  }

  /**
   * Delete a widget for a visualization.
   *
   * @param {Object} data
   * @returns {Promise<boolean>}
   */
  public deleteWidget(data: {id: string}): Promise<boolean> {
    return this.fetch({
      url: '/widget/{id}',
      method: 'DELETE',
      query: data
    });
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
  ): Promise<boolean> {
    return this.fetch({
      url: '/{sourceKey}/visualizations/folder/{id}',
      method: 'DELETE',
      query: data,
      path: {sourceKey: dataSourceKey}
    });
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
  ): Promise<{visualizationId: number}> {
    return this.fetch({
      url: '/{sourceKey}/visualizations/{id}/duplicate',
      method: 'POST',
      body: data,
      path: {sourceKey: dataSourceKey}
    });
  }

  /**
   * Get a visualization widget's data by key
   *
   * @param {Object} data
   * @returns {Promise<IWidget>}
   */
  public getWidget(data: {id: string}): Promise<IWidget> {
    return this.fetch({
      url: '/widget/{id}',
      method: 'GET',
      query: data
    });
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
  ): Promise<IVisualization> {
    return this.fetch({
      url: '/{sourceKey}/sandbox',
      method: 'GET',
      query: data,
      path: {sourceKey: dataSourceKey}
    }).then((res: any) => VisualizationParser.formatVisualization(res.visualization));
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
  ): Promise<IVisualization> {
    return this.fetch({
      url: '/{sourceKey}/visualizations/{id}',
      method: 'GET',
      query: data,
      path: {sourceKey: dataSourceKey}
    }).then((res: any) => VisualizationParser.formatVisualization(res.visualization));
  }

  /**
   * Return visualizations ordered with folders hierarchy.
   *
   * @param {string} dataSourceKey
   * @returns {Promise<ITreeChildren>}
   */
  public getTree(dataSourceKey?: string): Promise<ITreeChildren[]> {
    return this.fetch({
      url: '/{sourceKey}/visualizations/tree',
      method: 'GET'
    }).then((res: any) => res.tree);
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
  ): Promise<any> {
    return this.fetch({
      url: '/{sourceKey}/visualizations/{id}',
      method: 'DELETE',
      query: data,
      path: {sourceKey: dataSourceKey}
    });
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
  ): Promise<ISharers> {
    return this.fetch({
      url: '/{sourceKey}/visualizations/{id}/shares',
      method: 'GET',
      query: data,
      path: {sourceKey: dataSourceKey}
    });
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
  ): Promise<IShare> {
    return this.fetch({
      url: `/{sourceKey}/visualizations/${data.vizId}/share/${data.userId}`,
      method: 'PUT',
      body: {
        right: data.right
      },
      path: {sourceKey: dataSourceKey}
    });
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
  ): Promise<any> {
    return this.fetch({
      url: `/{sourceKey}/visualizations/{id}/share/${data.userId}`,
      method: 'DELETE',
      query: {id: data.id},
      path: {sourceKey: dataSourceKey}
    });
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
  ): Promise<any> {
    return this.fetch({
      url: '/{sourceKey}/sandbox',
      method: 'PATCH',
      body: {visualization: data},
      path: {sourceKey: dataSourceKey}
    });
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
      nodes?: IVisualizationNode[];
      edges?: IVisualizationEdge[];
      alternativeIds?: IAlternativeIdConfig;
      layout?: IVisualizationLayout;
      geo?: IVisualizationGeo;
      mode?: VisualizationModeType;
      filters?: any[];
      forceLock?: boolean;
    },
    dataSourceKey?: string
  ): Promise<any> {
    const vizBody: any = JSON.parse(JSON.stringify(data));
    vizBody.id = undefined;
    vizBody.forceLock = undefined;

    return this.fetch({
      url: '/{sourceKey}/visualizations/{id}',
      method: 'PATCH',
      body: {id: data.id, visualization: vizBody},
      query: Utils.fixSnakeCase({forceLock: data.forceLock})
    });
  }
}
