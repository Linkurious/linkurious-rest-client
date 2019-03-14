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
  IServerVisualization,
  IVisualization,
  IItem,
} from '../../index';

export class VisualizationParser {
  public static parseEdgeList(
    edges: [
      {
        id: string | number;
        source: string | number;
        target: string | number;
        type: string;
        data: any;
        readAt: string;
      }
    ]
  ): Array<IOgmaEdge> {
    return edges.map((e: IEdge) => VisualizationParser.parseEdge(e));
  }

  public static parseEdge(edge: {
    id: string | number;
    selected?: boolean;
    source: string | number;
    target: string | number;
    type: string;
    data: any;
    readAt: string;
  }): IOgmaEdge {
    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      data: {
        type: edge.type,
        selected: edge.selected,
        properties: edge.data,
        readAt: edge.readAt,
      },
    };
  }

  public static parseNode(node: {
    id: string | number;
    categories: Array<string>;
    data?: any;
    edges?: Array<any>;
    statistics?: any;
    nodelink?: any;
    geo?: INodeCoordinates;
    selected?: boolean;
    readAt: string;
  }): IOgmaNode {
    return {
      id: node.id,
      x: node.nodelink ? node.nodelink.x : undefined,
      y: node.nodelink ? node.nodelink.y : undefined,
      data: {
        categories: node.categories,
        properties: node.data,
        statistics: node.statistics,
        readAt: node.readAt,
        selected: node.selected,
        nodelink: node.nodelink,
        geo: node.geo,
      },
    };
  }

  /**
   * format visualization for Ogma
   */
  public static formatVisualization(viz: IServerVisualization): any {
    let visualization: IVisualization = JSON.parse(JSON.stringify(viz));
    visualization.nodes = viz.nodes.map((n: INode) => VisualizationParser.parseNode(n));
    visualization.edges = viz.edges.map((e: IEdge) => VisualizationParser.parseEdge(e));
    return visualization;
  }

  public static splitResponse(response: Array<IFullNode>, data?: any): { nodes: any[]; edges: any[] } {
    let mn: Map<any, any> = new Map();
    let me: Map<any, any> = new Map();
    response.forEach((node: IFullNode) => {
      if (data) {
        if (data.visibleNodes.indexOf(node.id) < 0 || data.ids.indexOf(node.id) < 0) {
          mn.set(node.id, VisualizationParser.parseNode(node));
        }
      } else {
        mn.set(node.id, VisualizationParser.parseNode(node));
      }
      node.edges.forEach((edge: IEdge) => {
        me.set(edge.id, VisualizationParser.parseEdge(edge));
      });
    });

    return {
      nodes: Array.from(mn.values()),
      edges: Array.from(me.values()),
    };
  }
}
