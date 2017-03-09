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
import { Utils } from '../http/utils';
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
      res.results.forEach((node:IFullNode, index:number) => {
        results.push(VisualizationParser.refactorItem(node));
        node.edges.forEach((edge:IEdge) => {
          if (results[index].edges) {
            results[index].edges.push(VisualizationParser.refactorItem(edge));
          } else {
            results[index].edges = [VisualizationParser.refactorItem(edge)];
          }
        });
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
        body  : Utils.fixSnakeCase(data)
      }
    ).then((response:Array<IFullNode>) => VisualizationParser.splitResponse(response));
  }
}
