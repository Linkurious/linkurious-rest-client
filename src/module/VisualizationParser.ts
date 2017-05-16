/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2017
 *
 * Created by maximeallex on 2017-02-06.
 */
'use strict';
import { IUpdateVisualization, IVisualization, IFullNode, IEdge } from '../../index';
import { LONGITUDE_HEURISTIC, LATITUDE_HEURISTIC } from '../index';

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
      geo : item.geo,
      selected  : item.selected,
      categories: item.categories,
      version   : item.version,
      type      : item.type,
      nodelink  : item.nodelink,
      statistics: item.statistics
    };

    if (VisualizationParser.isNode(item)) {
      if ( !item.geo.latitude && !item.geo.longitude ) {
        Object.keys(item.data.properties).forEach((key:any) => {
          if ( item.data.properties[key] && LONGITUDE_HEURISTIC.indexOf(key) > -1 ) {
            item.data.geo.longitude = VisualizationParser.computeCoordinate(item.data.properties[key]);
          }
          if ( item.data.properties[key] && LATITUDE_HEURISTIC.indexOf(key) > -1 ) {
            item.data.geo.latitude = VisualizationParser.computeCoordinate(item.data.properties[key]);
          }
        });
      }

      if ( item.data.geo && item.data.geo.longitude && item.data.geo.latitude ) {
        item.longitude = (item.data.geo.longitudeDiff)
          ? item.data.geo.longitude + item.data.geo.longitudeDiff
          : item.data.geo.longitude;
        item.latitude = (item.data.geo.latitudeDiff)
          ? item.data.geo.latitude + item.data.geo.latitudeDiff
          : item.data.geo.latitude;
      }
    }

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

  private static computeCoordinate(property:string|number):number {
    return (typeof property === 'number')
      ? property
      : parseFloat(property.replace(',', '.'));
  }

  private static isNode(item:any):boolean {
    return item.categories && !item.type && !item.source && !item.target;
  }
}
