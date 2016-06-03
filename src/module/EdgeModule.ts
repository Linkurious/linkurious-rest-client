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
import Module from './Module';
import {
  IEdge,
  ItemId,
  IProperty,
  IItemType
} from '../interfaces';
import Fetcher from '../http/fetcher';

export default class EdgeModule extends Module {

  constructor(fetcher: Fetcher) {
    super(fetcher);
  }

  /**
   * return the number of edges in the graph.
   *
   * @returns {Promise<number>}
   */
  public count():Promise<number> {
    return this.fetch({
      url   : '/{dataSourceKey}/graph/edges/count',
      method: 'GET'
    }).then(r => r.count);
  }

  /**
   * Add an edge in the graph.
   *
   * @param data : object
   * @returns {Promise<Edge>}
   */
  public create(data: Request.ICreateEdge):Promise<IEdge> {
    return this.fetch({
      url   : '/{dataSourceKey}/graph/edges',
      method: 'POST',
      body  : data
    });
  }

  /**
   * Modify the properties of an edge in the graph by the given ones. Keeps the other properties of
   * the edge unchanged.
   *
   * @param edgeId : ItemId
   * @param data : Edge.form.update
   * @returns {Promise<Edge>}
   */
  public update(data:Request.IUpdateEdge):Promise<IEdge> {
    return this.fetch({
      url   : '/{dataSourceKey}/graph/edges/{id}',
      method: 'PATCH',
      body  : data
    });
  }

  /**
   * Delete a edge from the graph.
   *
   * @param edgeId : ItemId
   * @returns {Promise<string>}
   */
  public deleteOne(edgeId: ItemId):Promise<boolean> {
    return this.fetch({
        url   : '/{dataSourceKey}/graph/edges/{id}',
        method: 'DELETE',
        body:{id:edgeId}
      }).then(() => true);
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
  public getAdjacentFromNode(data: Request.IGetAdjacentEdges):Promise<Array<IEdge>> {
    // clone
    let query: any = JSON.parse(JSON.stringify(data));
    if (query.orientation === 'in') {
      query['source'] = data.nodeId;
    } else if (data.orientation === 'out') {
      query['target'] = data.nodeId;
    } else if (data.orientation === 'both') {
      query['adjacent'] = data.nodeId;
    }
    query.nodeId = undefined;
    query.orientation = undefined;

    return this.fetch({
      url   : '/{dataSourceKey}/graph/edges',
      method: 'GET',
      query : query
    });
  }

  /**
   * Get an edge of the graph.
   *
   * @param edgeId : ItemId
   * @returns {Promise<Edge.model>}
   */
  public getOne(edgeId: ItemId):Promise<IEdge> {
    return this.fetch({
      url   : '/{dataSourceKey}/graph/edges/{id}',
      method: 'GET',
      body : {id:edgeId}
    });
  }

  /**
   * List all edgeType properties (aggregated from all edgeTypes)
   *
   * @param params:Interface.RequestProperties
   * @returns {Promise<Schema.propertyList>}
   */
  public getProperties(params?: Request.IGetItemProperties):Promise<Array<IProperty>> {
    return this.fetch({
      url   : '/{dataSourceKey}/graph/schema/edgeTypes/properties',
      method: 'GET',
      query : params
    }).then(res => res.properties);
  }

  /**
   * List edge-types indexed by linkurious
   *
   * @param params:Interface.RequestEdgeType
   * @returns {Promise<Schema.typesList>}
   */
  public getTypes(params?: Request.IGetEdgeTypes):Promise<Array<IItemType>> {
    return this.fetch({
      url   : '/{dataSourceKey}/graph/schema/edgeTypes',
      method: 'GET',
      query : params
    }).then(res => res.edgeTypes);
  }

}
