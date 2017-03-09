/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2017
 *
 * Created by maximeallex on 2017-02-06.
 */
'use strict';
import { IUpdateVisualization, IVisualization, IFullNode, IEdge } from '../../index';

/**
 * @class
 * @classdesc VisualizationParser : format server response for Ogma
 */
export class VisualizationParser {
  /**
   * format visualization for Ogma
   * @param viz
   * @returns {any}
   */
  public static formatVisualization(viz:IVisualization|IUpdateVisualization):any {
    let result:any = JSON.parse(JSON.stringify(viz));
    VisualizationParser.refactorItemsForOgma(result.nodes);
    VisualizationParser.refactorItemsForOgma(result.edges);
    return result;
  }

  /**
   * format nodes and edges for ogma
   * @param items
   */
  public static refactorItemsForOgma(items:Array<any>):any {
    return items.map((item:any) => {
      VisualizationParser.refactorItem(item);
    });
  }

  public static refactorItem(item:any):any {
    let data:any = JSON.parse(JSON.stringify(item.data));
    if ( item.nodelink ) {
      item.x = item.nodelink.x;
      item.y = item.nodelink.y;
    }
    item.data = {
      properties: data,
      selected  : item.selected,
      categories: item.categories,
      version   : item.version,
      type      : item.type,
      nodelink  : item.nodelink,
      statistics: item.statistics
    };
    delete item.nodelink;
    delete item.version;
    return item;
  }

  public static splitResponse (response:Array<IFullNode>):{nodes:any[], edges:any[]} {
    let mn:Map<any, any> = new Map();
    let me:Map<any, any> = new Map();
    response.forEach((node:IFullNode) => {
      mn.set(node.id, VisualizationParser.refactorItem(node));
      node.edges.forEach((edge:IEdge) => {
        me.set(edge.id, VisualizationParser.refactorItem(edge));
      });
    });

    return {
      nodes : Array.from(mn.values()),
      edges : Array.from(me.values())
    };
  }
}
