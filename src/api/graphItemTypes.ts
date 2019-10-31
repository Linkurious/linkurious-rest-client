/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-21.
 */

export interface NativeTemporalValue {
  value: number;
}

export interface NativeDate extends NativeTemporalValue {}

export interface NativeDateTime extends NativeTemporalValue {}

export type LkProperty = string | number | boolean | NativeDate | NativeDateTime;

export interface LkProperties {
  [key: string]: LkProperty;
}

export interface LkItemData {
  properties: LkProperties;
  readAt: number;
}

export interface LkItem {
  id: string;
  data: LkItemData;
}

// LkNode
export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface GeoData {
  original?: GeoCoordinates;
  current?: GeoCoordinates;
}

export interface LkDigestItem {
  nodeCategories: string[];
  edgeType: string;
  nodes: number;
  edges: number;
}

export interface LkEdgeDigestItem {
  edgeType: string;
  edges: number;
}

export interface LkNodeStatistics {
  degree?: number;
  supernode?: boolean;
  supernodeDigest?: LkEdgeDigestItem[];
  supernodeDegree?: number;
  digest?: LkDigestItem[];
}

export interface LkNodeData extends LkItemData {
  categories: string[];
  statistics?: LkNodeStatistics;
  geo: GeoData;
}

export interface LkNode extends LkItem {
  data: LkNodeData;
}

// LkEdge
export interface LkEdgeData extends LkItemData {
  type: string;
}

export interface LkEdge extends LkItem {
  source: string;
  target: string;
  data: LkEdgeData;
}

export interface LkSubGraph {
  nodes: LkNode[];
  edges: LkEdge[];
}

// VizNode & VizEdge
export interface VizNodeInfo {
  id: string;
  attributes: {
    x: number;
    y: number;
    layoutable: boolean;
    selected: boolean;
  };
  data: {
    geo: GeoData;
  };
}

export interface VizEdgeInfo {
  id: string;
  attributes: {
    selected: boolean;
  };
}

export type VizNode = LkNode & VizNodeInfo;
export type VizEdge = LkEdge & VizEdgeInfo;
