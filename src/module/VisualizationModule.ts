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
  IFolderFullResponse, ICreateWidget, ICreateFolder, ICreateVisualization, IDuplicateVisualization,
  IGetSandbox, ISetShareRights, IUnshareVisualization, IUpdateFolder, IUpdateSandbox,
  IUpdateVisualization, IGetVisualization
} from '../../index';
import { Module } from './Module';
import { Fetcher } from '../http/fetcher';
import { VisualizationParser } from './VisualizationParser';
import { Utils } from '../http/utils';

export class VisualizationModule extends Module {

  constructor ( fetcher:Fetcher ) {
    super(fetcher);
  }

  /**
   * get shared visualizations
   *
   * @returns {Promise<any>}
   */
  public getShared ():Promise<Array<IVisualization>> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/visualizations/shared',
        method: 'GET'
      }
    );
  }

  /**
   * Get the number of visualizations for the current user in this data-source.
   *
   * @returns {Promise<number>}
   */
  public count ():Promise<number> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/visualizations/count',
        method: 'GET'
      }
    ).then(( r:any ) => r.count);
  }

  /**
   * Create a widget for a visualization.
   *
   * @param {ICreateWidget} data
   * @returns {Promise<string>}
   */
  public createWidget ( data:ICreateWidget ):Promise<string> {
    return this.fetch(
      {
        url   : '/widget',
        method: 'POST',
        body  : data
      }
    );
  }

  /**
   * Update a widget for a visualization.
   *
   * @param {ICreateWidget} data
   * @returns {Promise<string>}
   */
  public updateWidget ( data:ICreateWidget ):Promise<string> {
    return this.fetch(
      {
        url   : '/widget',
        method: 'PUT',
        body  : data
      }
    );
  }

  /**
   * Create a folder for visualizations
   *
   * @param {ICreateFolder} data
   * @returns {Promise<IFolder>}
   */
  public createFolder ( data:ICreateFolder ):Promise<IFolder> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/visualizations/folder',
        method: 'POST',
        body  : data
      }
    ).then(( res:IFolderFullResponse ) => res.folder);
  }

  /**
   * Create a new visualization.
   *
   * @param {ICreateVisualization} data
   * @returns {Promise<IVisualization>}
   */
  public create ( data:ICreateVisualization ):Promise<IVisualization> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/visualizations',
        method: 'POST',
        body  : data
      }
    ).then(( res:any ) => res.visualization);
  }

  /**
   * Delete a widget for a visualization.
   *
   * @param {string} widgetKey
   * @returns {Promise<boolean>}
   */
  public deleteWidget ( widgetKey:string ):Promise<boolean> {
    return this.fetch(
      {
        url   : '/widget/' + widgetKey,
        method: 'DELETE'
      }
    ).then(() => true);
  }

  /**
   * Remove the specified folder and its children (visualizations and sub-folders)
   *
   * @param {number} folderId
   * @returns {Promise<boolean>}
   */
  public deleteFolder ( folderId:number ):Promise<boolean> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/visualizations/folder/' + folderId,
        method: 'DELETE'
      }
    )
      .then(() => true);
  }

  /**
   * Duplicates a visualization.
   *
   * @param {IDuplicateVisualization} data
   * @returns {Promise<IVisualization>}
   */
  public duplicate ( data:IDuplicateVisualization ):Promise<IVisualization> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/visualizations/{id}/duplicate',
        method: 'POST',
        body  : data
      }
    );
  }

  /**
   * Get a visualization widget's data by key
   *
   * @param {string} widgetKey
   * @returns {Promise<IWidget>}
   */
  public getWidget ( widgetKey:string ):Promise<IWidget> {
    return this.fetch(
      {
        url   : '/widget/' + widgetKey,
        method: 'GET'
      }
    );
  }

  /**
   * Return the visualization sandbox of the current user for a given data-source
   *
   * @param {IGetSandbox} params
   * @returns {Promise<IVisualization>}
   */
  public getSandbox ( params?:IGetSandbox ):Promise<IVisualization> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/sandbox',
        method: 'GET',
        query : params
      }
    ).then(( res:any ) => VisualizationParser.formatVisualization(res.visualization));
  }

  /**
   * Return one visualizations selected by ID.
   *
   * @param {IGetVisualization} data
   * @returns {Promise<IVisualization>}
   */
  public getOne ( data:IGetVisualization ):Promise<IVisualization> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/visualizations/{id}',
        method: 'GET',
        query : data
      }
    ).then(( res:any ) => VisualizationParser.formatVisualization(res.visualization));
  }

  /**
   * Return visualizations ordered with folders hierarchy.
   *
   * @returns {Promise<ITreeChildren>}
   */
  public getTree ():Promise<Array<ITreeChildren>> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/visualizations/tree',
        method: 'GET'
      }
    ).then(( res:any ) => res.tree);
  }

  /**
   * Remove visualization selected by id.
   *
   * @param {number} vizId
   * @returns {Promise<boolean>}
   */
  public deleteOne ( vizId:number ):Promise<boolean> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/visualizations/' + vizId,
        method: 'DELETE'
      }
    ).then(() => true);
  }

  /**
   * Get all share rights on a visualization
   * @param {number} vizId
   * @returns {Promise<ISharers>}
   */
  public getShares ( vizId:number ):Promise<ISharers> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/visualizations/' + vizId + '/shares',
        method: 'GET'
      }
    );
  }

  /**
   * Set the share right of a user on a visualization
   *
   * @param {ISetShareRights} data
   * @returns {Promise<IShare>}
   */
  public share ( data:ISetShareRights ):Promise<IShare> {
    let model:any = JSON.parse(JSON.stringify(data));
    let url:string = '/{dataSourceKey}/visualizations/' + model.vizId + '/share/' + model.userId;

    delete model.vizId;
    delete model.userId;

    return this.fetch(
      {
        url   : url,
        method: 'PUT',
        body  : {
          right: model.right
        }
      }
    );
  }

  /**
   * Remove a share right of a user on a visualization
   *
   * @param {IUnshareVisualization} data
   * @returns {Promise<boolean>}
   */
  public unshare ( data:IUnshareVisualization ):Promise<boolean> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/visualizations/' + data.id + '/share/' + data.userId,
        method: 'DELETE'
      }
    ).then(() => true);
  }

  /**
   * Update a property of a folder
   *
   * @param {IUpdateFolder} data
   * @returns {Promise<any>}
   */
  public updateFolder ( data:IUpdateFolder ):Promise<IFolder> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/visualizations/folder/{id}',
        method: 'PATCH',
        body  : data
      }
    ).then(( response:any ) => response.folder);
  }

  /**
   * Update the sandbox of the current user for a given data-source.
   *
   * @param {IUpdateSandbox} data
   * @returns {Promise<boolean>}
   */
  public updateSandbox ( data:IUpdateSandbox ):Promise<boolean> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/sandbox',
        method: 'PATCH',
        body  : data
      }
    ).then(() => true);
  }

  /**
   * Update visualization selected by id.
   *
   * @param {IUpdateVisualization} data
   * @returns {Promise<boolean>}
   */
  public update ( data:IUpdateVisualization ):Promise<boolean> {
    let vizBody:any = JSON.parse(JSON.stringify(data));
    vizBody.id = undefined;
    vizBody.forceLock = undefined;

    return this.fetch(
      {
        url   : '/{dataSourceKey}/visualizations/{id}',
        method: 'PATCH',
        body  : { id: data.id, visualization: vizBody },
        query : Utils.fixSnakeCase({ forceLock: data.forceLock })
      }
    );
  }
}
