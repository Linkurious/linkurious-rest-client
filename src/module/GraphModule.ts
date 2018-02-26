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

import { IEdge, IFullNode } from '../../index';
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
      withVersion ?:boolean;
      withDigest ?:boolean;
      withDegree?:boolean;
    },
    dataSourceKey?:string
  ):Promise<Array<Array<any>>> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/shortestPaths',
        method: 'GET',
        query : data,
        dataSource : dataSourceKey
      }
    ).then(( res:any ) => {
      let results:Array<any> = [];
      res.results.forEach((path:Array<IFullNode>) => {
        let resultPath:Array<any> = [];
        path.forEach((node:IFullNode, index:number) => {
          let edges:Array<any> = [];
          resultPath.push(VisualizationParser.parseNode(node));
          node.edges.forEach((edge:IEdge) => {
            edges.push(VisualizationParser.parseEdge(edge));
          });
          resultPath[index].edges = edges;
        });
        results.push(resultPath);
      });
      return results;
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
      withVersion?:boolean;
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
      withVersion : data.withVersion,
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
    ).then((response:any) => ( data.type !== 'subGraphs' )
      ? ( data.type === 'grouped' )
        ? VisualizationParser.splitResponse(response)
        : response
      : response.map((r:any) => {
        r.graph = VisualizationParser.splitResponse(r.nodes);
        return r;
      })
    );
  }
}
