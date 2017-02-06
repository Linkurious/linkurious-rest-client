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
  INode,
  IFullNode,
  ItemId,
  IDigest,
  IProperty,
  IItemType, ICreateNode, IGetNode, IGetAdjacentItems, IGetNeighborsCategories, IUpdateNode,
  IGetItemProperties, IGetItemTypes
} from '../../index';
import { Utils } from '../http/utils';
import { Module } from './Module';
import { Fetcher } from '../http/fetcher';
import { VisualizationParser } from './VisualizationParser';

export class NodeModule extends Module {

  constructor ( fetcher:Fetcher ) {
    super(fetcher);
  }

  /**
   * Number of nodes in the graph.
   *
   * @returns {Promise<number>}
   */
  public count ():Promise<number> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/nodes/count',
        method: 'GET'
      }
    ).then(( res:any ) => res.count);
  }

  /**
   * Add a node in the graph.
   *
   * @param {ICreateNode} data
   * @returns {Promise<INode>}
   */
  public create ( data:ICreateNode ):Promise<INode> {

    let dataToSend:any = data;
    dataToSend.properties = data.data;
    delete dataToSend.data;

    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/nodes',
        method: 'POST',
        body  : data
      }
    );
  }

  /**
   * Delete the node and its adjacent edges from the graph.
   *
   * @param {ItemId}nodeId
   * @returns {Promise<boolean>}
   *
   */
  public deleteOne ( nodeId:ItemId ):Promise<boolean> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/nodes/{id}',
        method: 'DELETE',
        body  : { id: nodeId }
      }
    ).then(() => true);
  }

  /**
   * Get a node from the graph.
   *
   * @param {IGetNode} [params]
   * @returns {Promise<INode>}
   */
  public getOne ( params?:IGetNode ):Promise<IFullNode> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/nodes/{id}',
        method: 'GET',
        query : params
      }
    ).then((response:any) => VisualizationParser.refactorItem(response));
  }

  /**
   * Get all adjacent nodes and edges for one or many source nodes (ids). The result is an array of
   * nodes containing the sources nodes (ids) and their neighbors. Edges between sources nodes and
   * neighbors - as well as edges between neighbors themselves - are returned in each node's edges
   * field. If visible_nodes was specified, edges between source nodes or their neighbors and
   * visible nodes are also included.
   *
   * @param {IGetAdjacentItems} data
   * @returns {Promise<Array<INode>>}
   */
  public expand ( data:IGetAdjacentItems ):Promise<Array<INode>> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/nodes/expand',
        method: 'POST',
        body  : Utils.fixSnakeCase(data)
      }
    );
  }

  /**
   * Get node-categories and edge-types of neighbors
   *
   * @param {Array<number>} data
   * @returns {Promise<Array<IDigest>>}
   */
  public getNeighborsCategories ( data:IGetNeighborsCategories ):Promise<Array<IDigest>> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/neighborhood/digest',
        method: 'POST',
        body  : data
      }
    );
  }

  /**
   * Modify the properties of a node in the graph by the given ones, and keeps the other properties of the node.
   *
   * @param {IUpdateNode} data
   * @returns {Promise<INode>}
   */
  public update ( data:IUpdateNode ):Promise<INode> {

    let dataToSend:any = data;
    dataToSend.deleteProperties = data.deletedData;
    dataToSend.properties = data.data;
    delete dataToSend.deletedData;
    delete dataToSend.data;

    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/nodes/{id}',
        method: 'PATCH',
        body  : Utils.fixSnakeCase(data)
      }
    );
  }

  /**
   * List all node-type properties (aggregated from all nodeTypes)
   *
   * @param {IGetItemProperties} [params]
   * @returns {Promise<Array<IProperty>>}
   */
  public getProperties ( params?:IGetItemProperties ):Promise<Array<IProperty>> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/schema/nodeTypes/properties',
        method: 'GET',
        query : params
      }
    ).then(( res:any ) => res.properties);
  }

  /**
   * List node-types indexed by Linkurious
   *
   * @param {IGetItemTypes} [params]
   * @returns {Promise<Array<IItemType>>}
   */
  public getTypes ( params?:IGetItemTypes ):Promise<Array<IItemType>> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/schema/nodeTypes',
        method: 'GET',
        query : params
      }
    ).then(( res:any ) => res.nodeTypes);
  }
}
