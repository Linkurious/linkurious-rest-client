/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2017
 *
 * Created by maximeallex on 2017-02-06.
 */
'use strict';
import {
  IFullNode,
  IEdge,
  INode,
  IOgmaEdge,
  INodeCoordinates,
  IOgmaNode,
  IServerVisualization, IVisualization
} from '../../index';
import { LONGITUDE_HEURISTIC, LATITUDE_HEURISTIC } from '../index';

/**
 * @class
 * @classdesc VisualizationParser : format server response for Ogma
 */
export class VisualizationParser {

  public static parseEdgeList(
    edges:[{
      id:string|number;
      source:string|number;
      target:string|number;
      type:string;
      data:any;
      version:number;
    }]
  ):Array<IOgmaEdge> {
    return edges.map((e:IEdge) => VisualizationParser.parseEdge(e));
  }

  public static parseEdge(
    edge:{
      id:string|number;
      source:string|number;
      target:string|number;
      type:string;
      data:any;
      version?:number;
    }
  ):IOgmaEdge {
    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      data: {
        type: edge.type,
        properties: edge.data,
        version: edge.version
      }
    };
  }

  public static parseNode(node:{
    id:string|number;
    categories:Array<string>;
    data?:any;
    edges?:Array<any>;
    statistics?:any;
    version?:number;
    nodelink?:any;
    geo?:INodeCoordinates;
    selected?:boolean;
  }):IOgmaNode {
    let latitude:number;
    let longitude:number;
    if ( node.data ) {
      longitude = VisualizationParser.parseCoordinates('longitude', node);
      latitude = VisualizationParser.parseCoordinates('latitude', node);
    }
    return {
      id:node.id,
      x : (node.nodelink) ? node.nodelink.x : undefined,
      y : (node.nodelink) ? node.nodelink.y : undefined,
      data : {
        categories : node.categories,
        properties : node.data,
        statistics : node.statistics,
        version : node.version,
        selected : node.selected,
        nodelink : node.nodelink,
        geo : node.geo
      },
      latitude : latitude,
      longitude : longitude
    };
  }

  /**
   * format visualization for Ogma
   * @param {IServerVisualization}viz
   * @returns {any}
   */
  public static formatVisualization(viz:IServerVisualization):any {
    let visualization:IVisualization = JSON.parse(JSON.stringify(viz));
    visualization.nodes = viz.nodes.map((n:INode) => VisualizationParser.parseNode(n));
    visualization.edges = viz.edges.map((e:IEdge) => VisualizationParser.parseEdge(e));
    return visualization;
  }

  public static splitResponse (response:Array<IFullNode>, data?:any):{nodes:any[], edges:any[]} {
    let mn:Map<any, any> = new Map();
    let me:Map<any, any> = new Map();
    response.forEach((node:IFullNode) => {
      if ( data ) {
        if ( data.visibleNodes.indexOf(node.id) < 0 || data.ids.indexOf(node.id) < 0 ) {
          mn.set(node.id, VisualizationParser.parseNode(node));
        }
      } else {
        mn.set(node.id, VisualizationParser.parseNode(node));
      }
      node.edges.forEach((edge:IEdge) => {
        me.set(edge.id, VisualizationParser.parseEdge(edge));
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

  private static parseCoordinates(
    type:'latitude'|'longitude',
    item:{
      id:string|number;
      categories:Array<string>;
      data?:any;
      statistics?:any;
      version?:number;
      nodelink?:any;
      geo?:any;
      selected?:boolean;
    }
  ):number {
    let typeHeuristics:Array<string> = ( type === 'longitude' ) ? LONGITUDE_HEURISTIC : LATITUDE_HEURISTIC;
    let typeDiff:string = ( type === 'longitude' ) ? 'longitudeDiff' : 'latitudeDiff';

    if ( !item.geo || !item.geo[type] ) {
      Object.keys(item.data).forEach((key:any) => {
        if ( item.data[key] && typeHeuristics.indexOf(key) > -1 ) {
          if ( !item.geo ) {
            item.geo = {};
            item.geo[type] = VisualizationParser.computeCoordinate(item.data[key]);
          }
        }
      });
    }
    if ( item.geo && item.geo[type] ) {
      return  (item.geo[typeDiff])
        ? item.geo[type] - item.geo[typeDiff]
        : item.geo[type];
    }

    return undefined;
  }
}
