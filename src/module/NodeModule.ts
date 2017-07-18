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
  IFullNode,
  ItemId,
  IDigest,
  IProperty,
  IItemType, IOgmaNode, IOgmaEdge
} from '../../index';
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
  public count (dataSourceKey?:string):Promise<number> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/nodes/count',
        method: 'GET',
        dataSource: dataSourceKey
      }
    ).then(( res:any ) => res.count);
  }

  /**
   * Add a node in the graph.
   *
   * @param {ICreateNode} data
   * @param {string}dataSourceKey
   * @returns {Promise<INode>}
   */
  public create (
    data:{
      properties ?:any;
      categories ?:Array<string>;
    },
    dataSourceKey?:string
  ):Promise<any> {
    return this.fetch({
      url   : '/{dataSourceKey}/graph/nodes',
      method: 'POST',
      body  : data,
      dataSource : dataSourceKey
    }).then((node:any) => VisualizationParser.parseNode(node));
  }

  /**
   * Delete the node and its adjacent edges from the graph.
   *
   * @param {any}data
   * @param {string}dataSourceKey
   * @returns {Promise<boolean>}
   *
   */
  public deleteOne (
    data:{
      id:number|string
    },
    dataSourceKey?:string
  ):Promise<any> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/nodes/{id}',
        method: 'DELETE',
        body  : data,
        dataSource : dataSourceKey
      }
    );
  }

  /**
   * Get a node from the graph.
   *
   * @param {IGetNode} [params]
   * @param {string}dataSourceKey
   * @returns {Promise<INode>}
   */
  public getOne (
    params?:{
      id:string|number;
      withEdges?:boolean;
      withDigest?:boolean;
      withVersion?:boolean;
    },
    dataSourceKey?:string
  ):Promise<{nodes:Array<IOgmaNode>, edges:Array<IOgmaEdge>}> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/nodes/{id}',
        method: 'GET',
        query : params
      }
    ).then((response:any) => VisualizationParser.splitResponse([response]));
  }

  /**
   * Get all adjacent nodes and edges for one or many source nodes (ids). The result is an array of
   * nodes containing the sources nodes (ids) and their neighbors. Edges between sources nodes and
   * neighbors - as well as edges between neighbors themselves - are returned in each node's edges
   * field. If visible_nodes was specified, edges between source nodes or their neighbors and
   * visible nodes are also included.
   *
   * @param {IGetAdjacentItems} data
   * @param {string}dataSourceKey
   * @returns {Promise<Array<INode>>}
   */
  public expand (
    data:{
      ids:Array<ItemId>;
      ignoredNodes?:Array<ItemId>;
      visibleNodes?:Array<ItemId>;
      nodeCategory?:string;
      edgeType?:string;
      limit?:number;
      limitType?:string;
      withVersion:boolean;
      withDigest?:boolean;
    },
    dataSourceKey?:string
  ):Promise<{nodes:Array<IOgmaNode>, edges:Array<IOgmaEdge>}> {
    let body:any = {
      ids : data.ids,
      ignoredNodes : data.ignoredNodes,
      visibleNodes : data.visibleNodes,
      nodeCategory: data.nodeCategory,
      edgeType:data.edgeType,
      limit:data.limit,
      limitType:data.limitType
    };
    return this.fetch({
      url   : '/{dataSourceKey}/graph/nodes/expand',
      method: 'POST',
      body  : body,
      query : {withVersion:data.withVersion, withDigest:data.withDigest},
      dataSource : dataSourceKey
    }).then((nodes:Array<IFullNode>) => VisualizationParser.splitResponse(nodes, data));
  }

  /**
   * Get node-categories and edge-types of neighbors
   *
   * @param {Array<number>} data
   * @param {string}dataSourceKey
   * @returns {Promise<Array<IDigest>>}
   */
  public getNeighborsCategories (
    data:{
      ids:Array<ItemId>;
      withDigest?:boolean;
      withDegree?:boolean;
    },
    dataSourceKey?:string
  ):Promise<Array<IDigest>> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/neighborhood/statistics',
        method: 'POST',
        body  : {ids: data.ids},
        query : {withDigest:data.withDigest, withDegree:data.withDegree},
        dataSource : dataSourceKey
      }
    );
  }

  /**
   * Modify the properties of a node in the graph by the given ones, and keeps the other properties of the node.
   *
   * @param {IUpdateNode} data
   * @param {string}dataSourceKey
   * @returns {Promise<INode>}
   */
  public update (
    data:{
      id:string|number;
      properties?:any;
      deletedProperties?:Array<string>;
      addedCategories?:Array<string>;
      deletedCategories?:Array<string>;
      version:number;
    },
    dataSourceKey?:string
  ):Promise<any> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/nodes/{id}',
        method: 'PATCH',
        body  : data,
        dataSource: dataSourceKey
      }
    );
  }

  /**
   * List all node-type properties (aggregated from all nodeTypes)
   *
   * @param {IGetItemProperties} [params]
   * @param {string}dataSourceKey
   * @returns {Promise<Array<IProperty>>}
   */
  public getProperties (
    params?:{
      includeType ?:string;
      omitNoindex ?:boolean;
    },
    dataSourceKey?:string
  ):Promise<Array<IProperty>> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/schema/nodeTypes/properties',
        method: 'GET',
        query : params,
        dataSource : dataSourceKey
      }
    ).then(( res:any ) => res.properties);
  }

  /**
   * List node-types indexed by Linkurious
   *
   * @param {IGetItemTypes} [params]
   * @param {string}dataSourceKey
   * @returns {Promise<Array<IItemType>>}
   */
  public getTypes (
    params?:{
      includeType ?:boolean;
      omitInferred:boolean;
    },
    dataSourceKey?:string
  ):Promise<Array<IItemType>> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/schema/nodeTypes',
        method: 'GET',
        query : params,
        dataSource : dataSourceKey
      }
    ).then(( res:any ) => res.nodeTypes);
  }
}
