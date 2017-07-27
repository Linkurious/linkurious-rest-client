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

import { IEdge, IFullNode, IGetShortestPaths, ISendQuery } from '../../index';
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
   * @param {IGetShortestPaths} nodesConfig
   * @returns {Promise<Array<Array<IFullNode|IEdge>>>}
   */
  public getShortestPaths ( nodesConfig:IGetShortestPaths ):Promise<Array<Array<IFullNode|IEdge>>> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/shortestPaths',
        method: 'GET',
        query : nodesConfig
      }
    ).then(( res:any ) => {
      let results:Array<any> = [];
      res.results.forEach((path:Array<IFullNode>) => {
        let resultPath:Array<IFullNode> = [];
        path.forEach((node:IFullNode, index:number) => {
          let edges:Array<IEdge> = [];
          resultPath.push(VisualizationParser.refactorItem(node));
          node.edges.forEach((edge:IEdge) => {
            edges.push(VisualizationParser.refactorItem(edge));
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
   * @param {ISendQuery} data
   * @returns {Promise<Array<INode>>}
   */
  public getNodeList ( data:ISendQuery ):Promise<{nodes:any[], edges:any[]}> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/rawQuery',
        method: 'POST',
        body  : data
      }
    ).then((response:Array<IFullNode>) => ( data.groupResults !== false )
      ? VisualizationParser.splitResponse(response)
      : response
    );
  }
}
