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

export default class Node extends Module {

  constructor(fetcher) {
    super(fetcher)
  }

  /**
   * Number of nodes in the graph.
   *
   * @returns {Promise<Interface.count>}
   */
  public count():Promise<i.Count> {
    return this.fetch({
      url   : '/dataSource/graph/nodes/count',
      method: 'GET'
    });
  }

  /**
   * Add a node in the graph.
   *
   * @param data:Interface.Form.node.create
   * @returns {Promise<Node.model>}
   */
  public create(data:i.Node.form.create):Promise<i.Node.model> {
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
  public deleteOne(nodeId:i.ItemId):Promise<boolean> {
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
  public getOne(nodeId:i.ItemId, params?:i.Node.request.one):Promise<i.Node.model> {
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
  public expand(data:i.Node.request.adjacentItems):Promise<Array<i.Node.model>> {
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
  public getNeighborsCategories(data:i.Node.request.neighborsCategories):Promise<Array<i.Schema.digest>> {
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
  public update(nodeId:i.ItemId, data:i.Node.form.update):Promise<i.Node.model> {
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
  public getProperties(params?:i.Schema.request.properties):Promise<i.Schema.propertyList> {
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
  public getTypes(params?:i.Node.request.types):Promise<i.Schema.typesList> {
    return this.fetch({
      url   : '/{dataSource}/graph/schema/nodeTypes',
      method: 'GET',
      query : Utils.fixSnakeCase(params)
    });
  }
}