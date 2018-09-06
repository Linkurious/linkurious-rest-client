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

import { IEdge, IFullNode, INode, IOgmaEdge, IOgmaNode } from '../../index';
import { Module } from './Module';
import { Fetcher } from '../http/fetcher';
import { VisualizationParser } from './VisualizationParser';

export class GraphModule extends Module {
  constructor ( fetcher:Fetcher ) {
    super(fetcher);
  }

  /**
   * Returns an array of <LkNode[]> corresponding to all the shortest paths between two nodes that the user can read.
   *
   * @param {Object} data
   * @param {string} dataSourceKey
   * @returns {Promise<Array<Array<IFullNode|IEdge>>>}
   */
  public getShortestPaths (
    data:{
      startNode:string|number;
      endNode:string|number;
      maxDepth ?:number;
      edgesTo?:boolean;
      withDigest ?:boolean;
      withDegree?:boolean;
    },
    dataSourceKey?:string
  ):Promise<{results:Array<{nodes:Array<IOgmaNode>; edges:Array<IOgmaEdge>}>}> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/shortestPaths',
        method: 'POST',
        query : data,
        dataSource : dataSourceKey
      }
    ).then(( res:any ) => {
      return {
        results: res.results.map((result:{nodes:Array<INode>; edges:Array<IEdge>}) => {
          return {
            nodes: result.nodes.map((n:INode) => VisualizationParser.parseNode(n)),
            edges: result.edges.map((e:IEdge) => VisualizationParser.parseEdge(e))
          };
        })
      };
    });
  }

  /**
   * Returns an array of LkNode[] matching the sent query.
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<Array<INode>>}
   */
  public runQuery (
    data:{
      dialect?:string;
      query:string;
      limit?:number;
      timeout?:number,
      columns?:Array<{type:string, columnName:string}>,
      edgesTo?:Array<string|number>;
      withDegree?:boolean;
      withDigest?:boolean;
      templateData?:any;
      type?:'grouped'|'subGraphs'|'dryRun';
    },
    dataSourceKey?:string
  ):Promise<{nodes:any[], edges:any[]}|Array<{graph:{nodes:any[], edges:any[]}}>> {
    let body:any = {
      dialect: data.dialect,
      query: data.query,
      columns: data.columns,
      limit: data.limit,
      timeout: data.timeout,
      type: data.type,
      templateData: data.templateData
    };
    let query:any = {
      withDigest : data.withDigest,
      withDegree : data.withDegree
    };
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/rawQuery',
        method: 'POST',
        body  : body,
        query : query,
        dataSource : dataSourceKey
      }
    ).then((response:any) => {
        if ( data.type === 'subGraphs' ) {
          return {
            nodes: response.nodes.map((n:INode) => VisualizationParser.parseNode(n)),
            edges: response.edges.map((e:IEdge) => VisualizationParser.parseEdge(e)),
            columns: response.column
          };
        } else if ( data.type === 'grouped' ) {
          return {
            nodes: response.nodes.map((n:INode) => VisualizationParser.parseNode(n)),
            edges: response.edges.map((e:IEdge) => VisualizationParser.parseEdge(e))
          };
        } else {
          return response;
        }
      }
    );
  }
}
