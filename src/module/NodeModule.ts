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
  INode,
  ItemId,
  IDigest,
  IProperty,
  IItemType
} from '../interfaces';
import Utils from '../http/utils';
import Module from './Module';
import Fetcher from '../http/fetcher';

export default class NodeModule extends Module {

  constructor(fetcher: Fetcher) {
    super(fetcher)
  }

  /**
   * Number of nodes in the graph.
   *
   * @returns {Promise<number>}
   */
  public count():Promise<number> {
    return this.fetch({
      url   : '/{dataSourceKey}/graph/nodes/count',
      method: 'GET'
    }).then(r => r.count);
  }

  /**
   * Add a node in the graph.
   *
   * @param data:Interface.Form.node.create
   * @returns {Promise<Node.model>}
   */
  public create(data:Request.ICreateNode):Promise<INode> {
    return this.fetch({
      url   : '/{dataSourceKey}/graph/nodes',
      method: 'POST',
      body  : data
    });
  }

  /**
   * Delete the node and its adjacent edges from the graph.
   *
   * @param nodeId:ItemId
   * @returns {Promise<string>}
   *
   */
  public deleteOne(nodeId:ItemId):Promise<boolean> {
    return this.fetch({
      url   : '/{dataSourceKey}/graph/nodes/{id}',
      method: 'DELETE',
      body : {id:nodeId}
    }).then(() => true);
  }

  /**
   * Get a node from the graph.
   *
   * @param params:Interface.RequestNode
   * @returns {Promise<Node.model>}
   */
  public getOne(params?:Request.IGetNode):Promise<INode> {
    return this.fetch({
      url   : '/{dataSourceKey}/graph/nodes/{id}',
      method: 'GET',
      query : params
    });
  }

  /**
   * Get all adjacent nodes and edges for one or many source nodes (ids). The result is an array of
   * nodes containing the sources nodes (ids) and their neighbors. Edges between sources nodes and
   * neighbors - as well as edges between neighbors themselves - are returned in each node's edges
   * field. If visible_nodes was specified, edges between source nodes or their neighbors and
   * visible nodes are also included.
   *
   * @param data:Interface.RequestNodeAdjacentItems
   * @returns {Promise<Array<Node.model>>}
   */
  public expand(data:Request.IGetAdjacentItems):Promise<Array<INode>> {
    return this.fetch({
      url   : '/{dataSourceKey}/graph/nodes/expand',
      method: 'POST',
      body  : Utils.fixSnakeCase(data)
    });
  }

  /**
   * Get node-categories and edge-types of neighbors
   *
   * @param data:Interface.RequestNodeNeighbors
   * @returns {Promise<Array<Schema.digest>>}
   */
  public getNeighborsCategories(data:Array<number>):Promise<Array<IDigest>> {
    return this.fetch({
      url   : '/{dataSourceKey}/graph/neighborhood/digest',
      method: 'POST',
      body  : data
    });
  }

  /**
   * Modify the properties of a node in the graph by the given ones, and keeps the other properties of the node.
   *
   * @param data:Interface.Form.node.update
   * @returns {Promise<Node>}
   */
  public update(data:Request.IUpdateNode):Promise<INode> {
    return this.fetch({
      url   : '/{dataSourceKey}/graph/nodes/{id}',
      method: 'PATCH',
      body  : Utils.fixSnakeCase(data)
    });
  }

  /**
   * List all node-type properties (aggregated from all nodeTypes)
   *
   * @param params:Interface.RequestProperties
   * @returns {Promise<Schema.propertyList>}
   */
  public getProperties(params?:Request.IGetItemProperties):Promise<Array<IProperty>> {
    return this.fetch({
      url   : '/{dataSourceKey}/graph/schema/nodeTypes/properties',
      method: 'GET',
      query : params
    }).then(res => res.properties);
  }

  /**
   * List node-types indexed by Linkurious
   *
   * @param params:Interface.RequestNodeType
   * @returns {Promise<Schema.typesList>}
   */
  public getTypes(params?:Request.IGetItemTypes):Promise<Array<IItemType>> {
    return this.fetch({
      url   : '/{dataSourceKey}/graph/schema/nodeTypes',
      method: 'GET',
      query : params
    }).then(res => res.nodeTypes);
  }
}
