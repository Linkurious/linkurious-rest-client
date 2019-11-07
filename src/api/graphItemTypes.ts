/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-21.
 */
import {GenericObject} from './commonTypes';
import {LkPropertyType, SimpleType, StringType, DateType, DateTimeType} from './GraphSchema';

// Valid properties for edges and nodes
export type LkValidProperty = string | number | boolean | LkDate | LkDateTime;

export type LkValidProperties = GenericObject<LkValidProperty>;

// Item and Properties
export interface LkDate {
  type: 'date';
  value: string; // iso string in the correct timezone, e.g: "2019-07-22T00:00:00-08:00"
  timezone?: string; // e.g. "-08:00"
}

export interface LkDateTime {
  type: 'datetime';
  value: string; // iso string in the correct timezone, e.g: "2019-07-22T12:34:56-08:00"
  timezone?: string; // e.g. "-08:00"
}

export interface ConflictValue {
  type: LkPropertyType;
  status: 'conflict';
  original?: string; // when schema is in conflict we return a string representation
}

export interface InvalidValue {
  type: SimpleType | StringType | DateType | DateTimeType;
  status: 'invalid';
  original: string; // when not of the good type we return a string representation (string[] fall in this category)
}

export interface MissingValue {
  type: LkPropertyType;
  status: 'missing'; // when mandatory or strict mode but not there
  mandatory: boolean;
}

export type LkProperty =
  | string
  | number
  | boolean
  | LkDate
  | LkDateTime
  | MissingValue
  | InvalidValue
  | ConflictValue;

export type LkProperties = GenericObject<LkProperty>;

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
