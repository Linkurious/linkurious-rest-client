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
import {Utils} from './utils';

export default class Node {

  private fetcher : i.Fetcher;

  constructor(fetcherInst:i.Fetcher){
    this.fetcher = <i.Fetcher>fetcherInst;
  }

  /**
   * Number of nodes in the graph.
   *
   * @returns {Promise<Interface.count>}
   */
  public count():Promise<i.Count> {
    return this.fetcher.fetch('GET', '/{dataSource}/graph/nodes/count');
  }

  /**
   * Add a node in the graph.
   *
   * @param data:Interface.Form.node.create
   * @returns {Promise<Node.model>}
   */
  public create(data:i.Node.form.create):Promise<i.Node.model> {
    return this.fetcher.fetch('POST', '/{dataSource}/graph/nodes', data);
  }

  /**
   * Delete the node and its adjacent edges from the graph.
   *
   * @param nodeId:ItemId
   * @returns {Promise<string>}
   */
  public deleteOne(nodeId:i.ItemId):Promise<string> {
    return this.fetcher.fetch('DELETE', '/{dataSource}/graph/nodes/' + nodeId)
      .then(() => 'node ' + nodeId + ' deleted');
  }

  /**
   * Get a node from the graph.
   *
   * @param nodeId:ItemId
   * @param params:Interface.RequestNode
   * @returns {Promise<Node.model>}
   */
  public getOne(nodeId:i.ItemId, params?:i.Node.request.one):Promise<i.Node.model> {
    return this.fetcher.fetch('GET', '/{dataSource}/graph/nodes/' + nodeId, Utils.fixCase(params));
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
    return this.fetcher.fetch('POST', '/{dataSource}/graph/nodes/expand', Utils.fixCase(data));
  }

  /**
   * Get node-categories and edge-types of neighbors
   *
   * @param data:Interface.RequestNodeNeighbors
   * @returns {Promise<Array<Schema.digest>>}
   */
  public getNeighborsCategories(data:i.Node.request.neighborsCategories):Promise<Array<i.Schema.digest>> {
    return this.fetcher.fetch('POST', '/{dataSource}/graph/neighborhood/digest', data);
  }

  /**
   * Modify the properties of a node in the graph by the given ones, and keeps the other properties of the node.
   *
   * @param nodeId:ItemId
   * @param data:Interface.Form.node.update
   * @returns {Promise<Node>}
   */
  public update(nodeId:i.ItemId, data:i.Node.form.update):Promise<i.Node.model> {
    return this.fetcher.fetch('PATCH', '/{dataSource}/graph/nodes/' + nodeId, Utils.fixCase(data));
  }

  /**
   * List all node-type properties (aggregated from all nodeTypes)
   *
   * @param params:Interface.RequestProperties
   * @returns {Promise<Schema.propertyList>}
   */
  public getProperties(params?:i.Schema.request.properties):Promise<i.Schema.propertyList> {
    return this.fetcher.fetch('GET', '/{dataSource}/graph/schema/nodeTypes/properties', Utils.fixCase(params));
  }

  /**
   * List node-types indexed by Linkurious
   *
   * @param params:Interface.RequestNodeType
   * @returns {Promise<Schema.typesList>}
   */
  public getTypes(params?:i.Node.request.types):Promise<i.Schema.typesList> {
    return this.fetcher.fetch('GET', '/{dataSource}/graph/schema/nodeTypes', Utils.fixCase(params));
  }
}