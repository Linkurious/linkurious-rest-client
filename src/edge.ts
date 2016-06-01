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
import {Utils} from './Utils';

export default class Edge {

  private fetcher;

  constructor(fetcherInst) {
    this.fetcher = fetcherInst;
  }

  /**
   * return the number of edges in the graph.
   *
   * @returns {Promise}
   */
  public count():Promise<any> {
    let fetchConfig = {
      url   : '/{dataSource}/graph/edges/count',
      method: 'GET'
    };

    return this.fetcher.fetch(fetchConfig);
  }

  /**
   * Add an edge in the graph.
   *
   * @param data : object
   * @returns {Promise<Edge>}
   */
  public create(data:i.Edge.form.create):Promise<i.Edge.model> {
    let fetchConfig = {
      url   : '/{dataSource}/graph/edges',
      method: 'POST',
      body  : data
    };

    return this.fetcher.fetch(fetchConfig);
  }

  /**
   * Modify the properties of an edge in the graph by the given ones. Keeps the other properties of
   * the edge unchanged.
   *
   * @param edgeId : ItemId
   * @param data : Edge.form.update
   * @returns {Promise<Edge>}
   */
  public update(edgeId:i.ItemId, data:i.Edge.form.update):Promise<i.Edge.model> {
    let fetchConfig = {
      url   : '/{dataSource}/graph/edges/' + edgeId,
      method: 'PATCH',
      body  : data
    };

    return this.fetcher.fetch(fetchConfig);
  }

  /**
   * Delete a edge from the graph.
   *
   * @param edgeId : ItemId
   * @returns {Promise<string>}
   */
  public deleteOne(edgeId:i.ItemId):Promise<boolean> {
    let fetchConfig = {
      url   : '/{dataSource}/graph/edges/' + edgeId,
      method: 'DELETE'
    };

    return this.fetcher.fetch(fetchConfig)
      .then(() => true);
  }

  /**
   * Get the adjacent edges of a node from the graph.
   * If source is provided, return outgoing edges only.
   * Else if target is provided, return incoming edges only.
   * Else if adjacent is provided, return all adjacent edges.
   *
   * @param data : object
   * @returns {Promise<Array<Edge.model>>}
   */
  public getAdjacentFromNode(data:i.Edge.request.getAdjacent):Promise<Array<i.Edge.model>> {
    let query;

    if (data.orientation === 'in') {
      data['source'] = data.nodeId;
    } else if (data.orientation === 'out') {
      data['target'] = data.nodeId;
    } else if (data.orientation === 'both') {
      data['adjacent'] = data.nodeId;
    }

    delete data.nodeId;
    delete data.orientation;

    query = Utils.fixSnakeCase(data);

    let fetchConfig = {
      url   : '/{dataSource}/graph/edges',
      method: 'GET',
      query : query
    };

    return this.fetcher.fetch(fetchConfig);
  }

  /**
   * Get an edge of the graph.
   *
   * @param edgeId : ItemId
   * @returns {Promise<Edge.model>}
   */
  public getOne(edgeId:i.ItemId):Promise<i.Edge.model> {
    let fetchConfig = {
      url   : '/{dataSource}/graph/edges/' + edgeId,
      method: 'GET'
    };

    return this.fetcher.fetch(fetchConfig);
  }

  /**
   * List all edgeType properties (aggregated from all edgeTypes)
   *
   * @param params:Interface.RequestProperties
   * @returns {Promise<Schema.propertyList>}
   */
  public getProperties(params?:i.Schema.request.properties):Promise<i.Schema.propertyList> {
    let fetchConfig = {
      url   : '/{dataSource}/graph/schema/edgeTypes/properties',
      method: 'GET',
      query : Utils.fixSnakeCase(params)
    };
    
    return this.fetcher.fetch(fetchConfig);
  }

  /**
   * List edge-types indexed by linkurious
   *
   * @param params:Interface.RequestEdgeType
   * @returns {Promise<Schema.typesList>}
   */
  public getTypes(params?:i.Edge.request.types):Promise<i.Schema.typesList> {
    let fetchConfig = {
      url   : '/{dataSource}/graph/schema/edgeTypes',
      method: 'GET',
      query : Utils.fixSnakeCase(params)
    };

    return this.fetcher.fetch(fetchConfig);
  }

}