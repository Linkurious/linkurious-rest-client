/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-21.
 */

// Graph Item
export interface INativeTemporalValue {
  value: number;
}

export interface INativeDate extends INativeTemporalValue {}

export interface INativeDateTime extends INativeTemporalValue {}

export type LkProperty = string | number | boolean | INativeDate | INativeDateTime;

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
// Graph Item - end

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
  geo: GeoData
}

export interface LkNode extends LkItem {
  data: LkNodeData;
}
// LkNode - end

// LkEdge
export interface LkEdgeData extends LkItemData {
  type: string;
}

export interface LkEdge extends LkItem {
  source: string;
  target: string;
  data: LkEdgeData;
}
// LkEdge - end

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
  },
  data: {
    geo: GeoData
  }
}

export interface VizEdgeInfo {
  id: string;
  selected: boolean;
}

export type VizNode = LkNode & VizNodeInfo;
export type VizEdge = LkEdge & VizEdgeInfo;
// VizNode & VizEdge - end
