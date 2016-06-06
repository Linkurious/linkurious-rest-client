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

import * as Query from '../Query';
import {
  IVisualization,
  IWidget,
  ITree,
  ISharers,
  IShare
} from '../interfaces';
import Module from './Module';
import Fetcher from '../http/fetcher';

export default class VisualizationModule extends Module {

  constructor(fetcher:Fetcher) {
    super(fetcher);
  }

  /**
   * Get the number of visualizations for the current user in this data-source.
   *
   * @returns {Promise<number>}
   */
  public count():Promise<number> {
    return this.fetch({
      url   : '/{dataSourceKey}/visualizations/count',
      method: 'GET'
    }).then((r:any) => r.count);
  }

  /**
   * Create a widget for a visualization.
   *
   * @param {ICreateWidget} data
   * @returns {Promise<string>}
   */
  public createWidget(data:Query.ICreateWidget):Promise<string> {
    return this.fetch({
      url   : '/widget',
      method: 'POST',
      body  : data
    });
  }

  /**
   * Create a folder for visualizations
   *
   * @param {ICreateFolder} data
   * @returns {Promise<boolean>}
   */
  public createFolder(data:Query.ICreateFolder):Promise<boolean> {
    return this.fetch({
      url   : '/{dataSourceKey}/visualizations/folder',
      method: 'POST',
      body  : data
    })
      .then(() => true);
  }

  /**
   * Create a new visualization.
   *
   * @param {ICreateVisualization} data
   * @returns {Promise<IVisualization>}
   */
  public create(data:Query.ICreateVisualization):Promise<IVisualization> {
    return this.fetch({
      url   : '/{dataSourceKey}/visualization',
      method: 'POST',
      body  : data
    });
  }

  /**
   * Delete a widget for a visualization.
   *
   * @param {string} widgetKey
   * @returns {Promise<boolean>}
   */
  public deleteWidget(widgetKey:string):Promise<boolean> {
    return this.fetch({
      url   : '/widget/' + widgetKey,
      method: 'DELETE'
    })
      .then(() => true);
  }

  /**
   * Remove the specified folder and its children (visualizations and sub-folders)
   *
   * @param {number} folderId
   * @returns {Promise<boolean>}
   */
  public deleteFolder(folderId:number):Promise<boolean> {
    return this.fetch({
      url   : '/{dataSourceKey}/visualizations/folder/' + folderId,
      method: 'DELETE'
    })
      .then(() => true);
  }

  /**
   * Duplicates a visualization.
   *
   * @param {number} vizId
   * @returns {Promise<IVisualization>}
   */
  public duplicate(vizId:number):Promise<IVisualization> {
    return this.fetch({
      url   : '/{dataSourceKey}/visualizations/' + vizId + '/duplicate',
      method: 'POST'
    });
  }

  /**
   * Get a visualization widget's data by key
   *
   * @param {string} widgetKey
   * @returns {Promise<IWidget>}
   */
  public getWidget(widgetKey:string):Promise<IWidget> {
    return this.fetch({
      url   : '/widget/' + widgetKey,
      method: 'GET'
    });
  }

  /**
   * Return the visualization sandbox of the current user for a given data-source
   *
   * @param {IGetSandbox} params
   * @returns {Promise<IVisualization>}
   */
  public getSandbox(params:Query.IGetSandbox):Promise<IVisualization> {
    return this.fetch({
      url   : '/{dataSourceKey}/sandbox',
      method: 'GET',
      query : params
    });
  }

  /**
   * Return one visualizations selected by ID.
   *
   * @param {number} vizId
   * @returns {Promise<IVisualization>}
   */
  public getOne(vizId:number):Promise<IVisualization> {
    return this.fetch({
      url   : '/{dataSourceKey}/visualizations/' + vizId,
      method: 'GET'
    });
  }

  /**
   * Return visualizations ordered with folders hierarchy.
   *
   * @returns {Promise<ITree>}
   */
  public getTree():Promise<ITree> {
    return this.fetch({
      url   : '/{dataSourceKey}/visualizations/tree',
      method: 'GET'
    });
  }

  /**
   * Remove visualization selected by id.
   *
   * @param {number} vizId
   * @returns {Promise<boolean>}
   */
  public deleteOne(vizId:number):Promise<boolean> {
    return this.fetch({
      url   : '/{dataSourceKey}/visualizations/' + vizId,
      method: 'DELETE'
    }).then(() => true);
  }

  /**
   * Get all share rights on a visualization
   * @param {number} vizId
   * @returns {Promise<ISharers>}
   */
  public getShares(vizId:number):Promise<ISharers> {
    return this.fetch({
      url   : '/{dataSourceKey}/visualizations/' + vizId + '/shares',
      method: 'GET'
    });
  }

  /**
   * Set the share right of a user on a visualization
   *
   * @param {ISetShareRights} data
   * @returns {Promise<IShare>}
   */
  public share(data:Query.ISetShareRights):Promise<IShare> {

    let url:string = '/{dataSourceKey}/visualizations/' + data.vizId + '/share/' + data.userId;

    delete data.vizId;
    delete data.userId;

    return this.fetch({
      url   : url,
      method: 'PUT',
      body  : {
        right: data.right
      }
    });
  }

  /**
   * Remove a share right of a user on a visualization
   *
   * @param {IUnshareVisualization} data
   * @returns {Promise<boolean>}
   */
  public unshare(data:Query.IUnshareVisualization):Promise<boolean> {
    return this.fetch({
      url   : '/{dataSourceKey}/visualizations/' + data.id + '/shared/' + data.userId,
      method: 'DELETE'
    }).then(() => true);
  }

  /**
   * Update a property of a folder
   *
   * @param {IUpdateFolder} data
   * @returns {Promise<boolean>}
   */
  public updateFolder(data:Query.IUpdateFolder):Promise<boolean> {
    return this.fetch({
      url   : '/{dataSourceKey}/visualizations/folder/{id}',
      method: 'PATCH',
      body  : data
    }).then(() => true);
  }

  /**
   * Update the sandbox of the current user for a given data-source.
   *
   * @param {IUpdateSandbox} data
   * @returns {Promise<boolean>}
   */
  public updateSandbox(data:Query.IUpdateSandbox):Promise<boolean> {
    return this.fetch({
      url   : '/{dataSourceKey}/sandbox',
      method: 'PATCH',
      body  : data
    }).then(() => true);
  }

  /**
   * Update visualization selected by id.
   *
   * @param {IUpdateVisualization} data
   * @returns {Promise<boolean>}
   */
  public update(data:Query.IUpdateVisualization):Promise<boolean> {
    return this.fetch({
      url   : '/{dataSourceKey}/visualizations/{id}',
      method: 'PATCH',
      body  : {id:data.id, visualization:data.visualization},
      query : {forceLock : data.forceLock}
    }).then(() => true);
  }
}
