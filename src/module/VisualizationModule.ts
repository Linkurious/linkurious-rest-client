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

import * as Request from '../Query';
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

  constructor(fetcher: Fetcher) {
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
    }).then(r => r.count);
  }

  /**
   * Create a widget for a visualization.
   *
   * @param data: Form.visualization.createWidget
   * @returns {Promise<string>}
   */
  public createWidget(data:Request.ICreateWidget):Promise<string> {
    return this.fetch({
      url   : '/widget',
      method: 'POST',
      body  : data
    });
  }

  /**
   * Create a folder for visualizations
   *
   * @param data:Interface.Form.visualization.createFolder
   * @returns {Promise<boolean>}
   */
  public createFolder(data:Request.ICreateFolder):Promise<boolean> {
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
   * @param data:ICreateVisualization
   * @returns {Promise<IVisualization>}
   */
  public create(data:Request.ICreateVisualization):Promise<IVisualization> {
    return this.fetch({
      url   : '/{dataSourceKey}/visualization',
      method: 'POST',
      body  : data
    });
  }

  /**
   * Delete a widget for a visualization.
   *
   * @param widgetKey:string
   * @returns {Promise<string>}
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
   * @param folderId:number
   * @returns {Promise<string>}
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
   * @param vizId:number
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
   * @param widgetKey:string
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
   * @param params:Interface.RequestSandbox
   * @returns {Promise<IVisualization>}
   */
  public getSandbox(params:Request.IGetSandbox):Promise<IVisualization> {
    return this.fetch({
      url   : '/{dataSourceKey}/sandbox',
      method: 'GET',
      query : params
    });
  }

  /**
   * Return one visualizations selected by ID.
   *
   * @param vizId:number
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
   * @param vizId:number
   * @returns {Promise<string>}
   */
  public deleteOne(vizId:number):Promise<boolean> {
    return this.fetch({
      url   : '/{dataSourceKey}/visualizations/' + vizId,
      method: 'DELETE'
    }).then(() => true);
  }

  /**
   * Get all share rights on a visualization
   * @param vizId:number
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
   * @param data:Interface.Form.visualization.share
   * @returns {Promise<IShare>}
   */
  public share(data:Request.ISetShareRights):Promise<IShare> {

    let url = '/{dataSourceKey}/visualizations/' + data.vizId + '/share/' + data.userId;

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
   * @param data:IUnshareVisualization
   * @returns {Promise<boolean>}
   */
  public unshare(data:Request.IUnshareVisualization):Promise<boolean> {
    return this.fetch({
      url   : '/{dataSourceKey}/visualizations/' + data.id + '/shared/' + data.userId,
      method: 'DELETE'
    }).then(() => true);
  }

  /**
   * Update a property of a folder
   *
   * @param data:Interface.Form.visualization.updateFolder
   * @returns {Promise<boolean>}
   */
  public updateFolder(data:Request.IUpdateFolder):Promise<boolean> {
    return this.fetch({
      url   : '/{dataSourceKey}/visualizations/folder/{id}',
      method: 'PATCH',
      body  : data
    }).then(() => true);
  }

  /**
   * Update the sandbox of the current user for a given data-source.
   *
   * @param data:Interface.Form.visualization.updateSandbox
   * @returns {Promise<boolean>}
   */
  public updateSandbox(data:Request.IUpdateSandbox):Promise<boolean> {
    return this.fetch({
      url   : '/{dataSourceKey}/sandbox',
      method: 'PATCH',
      body  : data
    }).then(() => true);
  }

  /**
   * Update visualization selected by id.
   *
   * @param vizId:number
   * @param data:Interface.Form.visualization.update
   * @returns {Promise<boolean>}
   */
  public update(vizId:number, data:Request.IUpdateVisualization):Promise<boolean> {
    return this.fetch({
      url   : '/{dataSourceKey}/visualizations/{id}',
      method: 'PATCH',
      body  : data
    }).then(() => true);
  }
}
