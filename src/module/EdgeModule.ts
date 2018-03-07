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
  IItemType,
  IOgmaEdge
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
   * @param {string}dataSourceKey
   * @returns {Promise<number>}
   */
  public count ( dataSourceKey?:string ):Promise<number> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/edges/count',
        method: 'GET',
        dataSource: dataSourceKey
      }
    ).then(( res:any ) => res.count);
  }

  /**
   * Add an edge in the graph.
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<IEdge>}
   */
  public create (
    data:{
      source:string | number;
      target:string | number;
      type:string;
      properties:any;
    },
    dataSourceKey?:string
  ):Promise<IOgmaEdge> {

    return this.fetch({
      url   : '/{dataSourceKey}/graph/edges',
      method: 'POST',
      body  : data,
      dataSource : dataSourceKey
    }).then((edge:any) => VisualizationParser.parseEdge(edge));
  }

  /**
   * Modify the properties of an edge in the graph by the given ones. Keeps the other properties of
   * the edge unchanged.
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<IEdge>}
   */
  public update (
    data:{
      id:string|number;
      type?:string;
      properties?:any;
      deletedProperties?:Array<string>;
      readAt:string;
    },
    dataSourceKey?:string
  ):Promise<IOgmaEdge> {

    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/edges/{id}',
        method: 'PATCH',
        body  : Utils.fixSnakeCase(data),
        dataSource: dataSourceKey
      }
    ).then((edge:IEdge) => VisualizationParser.parseEdge(edge));
  }

  /**
   * Delete a edge from the graph.
   *
   * @param {Object} data,
   * @param {string}dataSourceKey
   * @returns {Promise<boolean>}
   */
  public deleteOne (
    data:{
      id:string|number
    },
    dataSourceKey?:string
  ):Promise<any> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/edges/{id}',
        method: 'DELETE',
        body  : data,
        dataSource: dataSourceKey
      }
    );
  }

  /**
   * Get the adjacent edges of a node from the graph.
   * If source is provided, return outgoing edges only.
   * Else if target is provided, return incoming edges only.
   * Else if adjacent is provided, return all adjacent edges.
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<Array<IOgmaEdge>>}
   */
  public getAdjacentFromNode (
    data:{
      orientation:'in'|'out'|'both';
      type?:string;
      skip:number;
      limit:number;
      nodeId:ItemId;
    },
    dataSourceKey?:string
  ):Promise<Array<IOgmaEdge>> {
    let query:any = {
      type: data.type,
      skip: data.skip,
      limit: data.limit
    };

    if ( data.orientation === 'in' ) {
      query.source = data.nodeId;
    }

    if ( data.orientation === 'out' ) {
      query.target = data.nodeId;
    }

    if ( data.orientation === 'both' ) {
      query.adjacent = data.nodeId;
    }
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/edges',
        method: 'GET',
        query : query,
        dataSource: dataSourceKey
      }
    ).then((edges:any) => VisualizationParser.parseEdgeList(edges));
  }

  /**
   * Get an edge of the graph.
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<IEdge>}
   */
  public getOne (
    data:{
      id:ItemId
    },
    dataSourceKey?:string
  ):Promise<IOgmaEdge> {
    return this.fetch({
      url   : '/{dataSourceKey}/graph/edges/{id}',
      method: 'GET',
      query  : data,
      dataSource : dataSourceKey
    }).then((edge:any) => VisualizationParser.parseEdge(edge));
  }

  /**
   * List all edgeType properties (aggregated from all edgeTypes)
   *
   * @param {Object} [data]
   * @param {string}dataSourceKey
   * @returns {Promise<Array<IProperty>>}
   */
  public getProperties (
    data?:{
      includeType ?:string;
      omitNoindex ?:boolean;
    },
    dataSourceKey?:string
  ):Promise<Array<IProperty>> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/schema/edgeTypes/properties',
        method: 'GET',
        query : data,
        dataSource : dataSourceKey
      }
    ).then(( res:any ) => res.properties);
  }

  /**
   * List edge-types indexed by linkurious
   *
   * @param {Object} [data]
   * @param {string}dataSourceKey
   * @returns {Promise<Array<IItemType>>}
   */
  public getTypes (
    data?:{
      includeType ?:boolean;
    },
    dataSourceKey?:string
    ):Promise<Array<IItemType>> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/schema/edgeTypes',
        method: 'GET',
        query : data,
        dataSource : dataSourceKey
      }
    ).then(( res:any ) => <Array<IItemType>> res.edgeTypes);
  }
}
