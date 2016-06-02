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

import {Node, ItemId, Schema} from '../interfaces';
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
      url   : '/dataSource/graph/nodes/count',
      method: 'GET'
    }).then(r => r.count);
  }

  /**
   * Add a node in the graph.
   *
   * @param data:Interface.Form.node.create
   * @returns {Promise<Node.model>}
   */
  public create(data:Node.form.create):Promise<Node.model> {
    return this.fetch({
      url   : '/{dataSource}/graph/nodes',
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
      url   : '/{dataSource}/graph/nodes/' + nodeId,
      method: 'DELETE'
    }).then(() => true);
  }

  /**
   * Get a node from the graph.
   *
   * @param nodeId:ItemId
   * @param params:Interface.RequestNode
   * @returns {Promise<Node.model>}
   */
  public getOne(nodeId:ItemId, params?:Node.request.one):Promise<Node.model> {
    return this.fetch({
      url   : '/{dataSource}/graph/nodes/' + nodeId,
      method: 'GET',
      query : Utils.fixSnakeCase(params)
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
  public expand(data:Node.request.adjacentItems):Promise<Array<Node.model>> {
    return this.fetch({
      url   : '/{dataSource}/graph/nodes/expand',
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
  public getNeighborsCategories(data:Node.request.neighborsCategories):Promise<Array<Schema.digest>> {
    return this.fetch({
      url   : '/{dataSource}/graph/neighborhood/digest',
      method: 'POST',
      body  : data
    });
  }

  /**
   * Modify the properties of a node in the graph by the given ones, and keeps the other properties of the node.
   *
   * @param nodeId:ItemId
   * @param data:Interface.Form.node.update
   * @returns {Promise<Node>}
   */
  public update(nodeId:ItemId, data:Node.form.update):Promise<Node.model> {
    return this.fetch({
      url   : '/{dataSource}/graph/nodes/' + nodeId,
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
  public getProperties(params?:Schema.request.properties):Promise<Schema.propertyList> {
    return this.fetch({
      url   : '/{dataSource}/graph/schema/nodeTypes/properties',
      method: 'GET',
      query : Utils.fixSnakeCase(params)
    });
  }

  /**
   * List node-types indexed by Linkurious
   *
   * @param params:Interface.RequestNodeType
   * @returns {Promise<Schema.typesList>}
   */
  public getTypes(params?:Node.request.types):Promise<Schema.typesList> {
    return this.fetch({
      url   : '/{dataSource}/graph/schema/nodeTypes',
      method: 'GET',
      query : Utils.fixSnakeCase(params)
    });
  }
}
