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

import { Module } from './Module';
import {
  IEdge,
  ItemId,
  IProperty,
  IItemType, ICreateEdge, IUpdateEdge, IGetAdjacentEdges, IGetItemProperties, IGetEdgeTypes
} from '../../index';
import { Fetcher } from '../http/fetcher';
import { Utils } from '../http/utils';
import { VisualizationParser } from './VisualizationParser';

export class EdgeModule extends Module {

  constructor ( fetcher:Fetcher ) {
    super(fetcher);
  }

  /**
   * return the number of edges in the graph.
   *
   * @returns {Promise<number>}
   */
  public count ():Promise<number> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/edges/count',
        method: 'GET'
      }
    ).then(( res:any ) => res.count);
  }

  /**
   * Add an edge in the graph.
   *
   * @param {ICreateEdge} data
   * @returns {Promise<IEdge>}
   */
  public create ( data:ICreateEdge ):Promise<IEdge> {

    let dataToSend:any = data;
    dataToSend.properties = data.data;
    delete dataToSend.data;

    return this.fetch({
      url   : '/{dataSourceKey}/graph/edges',
      method: 'POST',
      body  : dataToSend
    }).then((edge:any) => VisualizationParser.refactorItem(edge));
  }

  /**
   * Modify the properties of an edge in the graph by the given ones. Keeps the other properties of
   * the edge unchanged.
   *
   * @param {IUpdateEdge} data
   * @returns {Promise<IEdge>}
   */
  public update ( data:IUpdateEdge ):Promise<IEdge> {

    let dataToSend:any = data;
    dataToSend.properties = data.data;
    dataToSend.deletedProperties = data.deletedData;
    delete dataToSend.data;
    delete dataToSend.deletedData;

    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/edges/{id}',
        method: 'PATCH',
        body  : Utils.fixSnakeCase(data)
      }
    );
  }

  /**
   * Delete a edge from the graph.
   *
   * @param {ItemId} edgeId
   * @returns {Promise<boolean>}
   */
  public deleteOne ( edgeId:ItemId ):Promise<boolean> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/edges/{id}',
        method: 'DELETE',
        body  : { id: edgeId }
      }
    ).then(() => true);
  }

  /**
   * Get the adjacent edges of a node from the graph.
   * If source is provided, return outgoing edges only.
   * Else if target is provided, return incoming edges only.
   * Else if adjacent is provided, return all adjacent edges.
   *
   * @param {IGetAdjacentEdges} data
   * @returns {Promise<Array<IEdge>>}
   */
  public getAdjacentFromNode ( data:IGetAdjacentEdges ):Promise<Array<IEdge>> {
    // clone
    let query:any = JSON.parse(JSON.stringify(data));
    if ( query.orientation === 'in' ) {
      query.source = data.nodeId;
    }

    if ( data.orientation === 'out' ) {
      query.target = data.nodeId;
    }

    if ( data.orientation === 'both' ) {
      query.adjacent = data.nodeId;
    }
    query.nodeId = undefined;
    query.orientation = undefined;
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/edges',
        method: 'GET',
        query : query
      }
    );
  }

  /**
   * Get an edge of the graph.
   *
   * @param {{id: ItemId, withVersion: boolean}} params
   * @returns {Promise<IEdge>}
   */
  public getOne ( params:{id:ItemId, withVersion:boolean} ):Promise<IEdge> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/edges/{id}',
        method: 'GET',
        body  : Utils.fixSnakeCase(params)
      }
    );
  }

  /**
   * List all edgeType properties (aggregated from all edgeTypes)
   *
   * @param {IGetItemProperties} [params]
   * @returns {Promise<Array<IProperty>>}
   */
  public getProperties ( params?:IGetItemProperties ):Promise<Array<IProperty>> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/schema/edgeTypes/properties',
        method: 'GET',
        query : params
      }
    ).then(( res:any ) => res.properties);
  }

  /**
   * List edge-types indexed by linkurious
   *
   * @param {IGetEdgeTypes} [params]
   * @returns {Promise<Array<IItemType>>}
   */
  public getTypes ( params?:IGetEdgeTypes ):Promise<Array<IItemType>> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/schema/edgeTypes',
        method: 'GET',
        query : params
      }
    ).then(( res:any ) => <Array<IItemType>> res.edgeTypes);
  }

}
