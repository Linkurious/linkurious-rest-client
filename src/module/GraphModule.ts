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
   * Run a static or template query
   *
   * @param {any} data
   * @param {string} dataSourceKey
   * @returns {Promise<any>}
   */
  public runQuery(data:{
    query:string;
    dialect?:string;
    limit?:number;
    timeout?:number,
    edgesTo?:Array<string|number>;
    withAccess?:boolean;
    withDegree?:boolean;
    withDigest?:boolean;
    templateData?:any;
  }, dataSourceKey?:string):Promise<{nodes:Array<IOgmaNode>; edges:Array<IOgmaEdge>}> {
    let body:any = {
      dialect: data.dialect,
      query: data.query,
      limit: data.limit,
      timeout: data.timeout,
      templateData: data.templateData
    };
    let query:any = {
      withDigest : data.withDigest,
      withDegree : data.withDegree,
      withAccess : data.withAccess
    };
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/runQuery',
        method: 'POST',
        body  : body,
        query : query,
        dataSource : dataSourceKey
      }
    ).then((response:any) => {
        return {
          nodes: response.nodes.map((n:INode) => VisualizationParser.parseNode(n)),
          edges: response.edges.map((e:IEdge) => VisualizationParser.parseEdge(e))
        };
      }
    );
  }

  /**
   * Return resolve if the current query is valid
   *
   * @param {any} data
   * @param {string} dataSourceKey
   * @returns {Promise<void>}
   */
  public checkQuery(data:{
    query:string;
    dialect?:string;
  }, dataSourceKey?:string):Promise<void> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/checkQuery',
        method: 'POST',
        body  : data,
        dataSource : dataSourceKey
      }
    );
  }
}
