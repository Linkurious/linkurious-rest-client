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

import * as i from './interfaces';
import Utils from './Utils';
import Module from "./Module";

export default class Visualization extends Module {

  constructor(fetcher) {
    super(fetcher);
  }

  /**
   * Get the number of visualizations for this data-source.
   *
   * @returns {Promise<Count>}
   */
  public count():Promise<i.Count> {
    return this.fetch({
      url   : '/{dataSource}/visualizations/count',
      method: 'GET'
    });
  }

  /**
   * Create a widget for a visualization.
   *
   * @param data:Interface.Form.visualization.createWidget
   * @returns {Promise<string>}
   */
  public createWidget(data:i.Visualization.form.createWidget):Promise<string> {
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
  public createFolder(data:i.Visualization.form.createFolder):Promise<boolean> {
    return this.fetch({
      url   : '/{dataSource}/visualizations/folder',
      method: 'POST',
      body  : data
    })
      .then(() => true);
  }

  /**
   * Create a new visualization.
   *
   * @param data:Interface.Form.visualization.create
   * @returns {Promise<Visualization.model>}
   */
  public create(data:i.Visualization.form.create):Promise<i.Visualization.model> {
    return this.fetch({
      url   : '/{dataSource}/visualization',
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
      url   : '/{dataSource}/visualizations/folder/' + folderId,
      method: 'DELETE'
    })
      .then(() => true);
  }

  /**
   * Duplicates a visualization.
   *
   * @param vizId:number
   * @returns {Promise<Visualization.model>}
   */
  public duplicate(vizId:number):Promise<i.Visualization.model> {
    return this.fetch({
      url   : '/{dataSource}/visualizations/' + vizId + '/duplicate',
      method: 'POST'
    });
  }

  /**
   * Get a visualization widget's data by key
   *
   * @param widgetKey:string
   * @returns {Promise<Visualization.widget>}
   */
  public getWidget(widgetKey:string):Promise<i.Visualization.widget> {
    return this.fetch({
      url   : '/widget/' + widgetKey,
      method: 'GET'
    });
  }

  /**
   * Return the visualization sandbox of the current user for a given data-source
   *
   * @param params:Interface.RequestSandbox
   * @returns {Promise<Visualization.model>}
   */
  public getSandbox(params:i.Visualization.request.sandbox):Promise<i.Visualization.model> {
    return this.fetch({
      url   : '/{dataSource}/sandbox',
      method: 'GET',
      query : Utils.fixSnakeCase(params)
    });
  }

  /**
   * Return one visualizations selected by ID.
   *
   * @param vizId:number
   * @returns {Promise<Visualization.model>}
   */
  public getOne(vizId:number):Promise<i.Visualization.model> {
    return this.fetch({
      url   : '/{dataSource}/visualizations/' + vizId,
      method: 'GET'
    });
  }

  /**
   * Return visualizations ordered with folders hierarchy.
   *
   * @returns {Promise<Visualization.tree>}
   */
  public getTree():Promise<i.Visualization.tree> {
    return this.fetch({
      url   : '/{dataSource}/visualizations/tree',
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
      url   : '/{dataSource}/visualizations/' + vizId,
      method: 'DELETE'
    }).then(() => true);
  }

  /**
   * Get all share rights on a visualization
   * @param vizId:number
   * @returns {Promise<Visualization.Shares>}
   */
  public getShares(vizId:number):Promise<i.Visualization.Shares> {
    return this.fetch({
      url   : '/{dataSource}/visualizations/' + vizId + '/shares',
      method: 'GET'
    });
  }

  /**
   * Set the share right of a user on a visualization
   *
   * @param data:Interface.Form.visualization.share
   * @returns {Promise<Visualization.shareRights>}
   */
  public share(data:i.Visualization.form.setShareRights):Promise<i.Visualization.shareRights> {
    return this.fetch({
      url   : '/{dataSource}/visualizations/' + data.vizId + '/share/' + data.userId,
      method: 'PUT',
      body  : {
        right: data.right
      }
    });
  }

  /**
   * Remove a share right of a user on a visualization
   *
   * @param data:Interface.Form.visualization.share
   * @returns {Promise<string>}
   */
  public unshare(data:i.Visualization.form.setShareRights):Promise<string> {
    return this.fetch({
      url   : '/{dataSource}/visualizations/' + data.vizId + '/shared/' + data.userId,
      method: 'DELETE'
    }).then(() => 'Visualization ' + data.vizId + 'unshared');
  }

  /**
   * Update a property of a folder
   *
   * @param folderId:number
   * @param data:Interface.Form.visualization.updateFolder
   * @returns {Promise<boolean>}
   */
  public updateFolder(folderId:number, data:i.Visualization.form.updateFolder):Promise<boolean> {
    return this.fetch({
      url   : '/{dataSource}/visualizations/folder/' + folderId,
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
  public updateSandbox(data:i.Visualization.form.updateSandbox):Promise<boolean> {
    return this.fetch({
      url   : '/{dataSource}/sandbox',
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
  public update(vizId:number, data:i.Visualization.form.update):Promise<boolean> {
    return this.fetch({
      url   : '/{dataSource}/visualizations/' + vizId,
      method: 'PATCH',
      body  : data
    }).then(() => true);
  }
}