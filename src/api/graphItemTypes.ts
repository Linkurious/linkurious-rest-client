/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-21.
 */
import {GenericObject} from './commonTypes';
import {PropertyTypeName, PropertyType} from './GraphSchema';
import {OgmaEdgeShape, OgmaNodeShape, IStyleIcon, IStyleImage} from './displayTypes';

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

// TODO return PropertyType for Conflict and Missing for consistency
export interface ConflictValue {
  type: PropertyTypeName;
  status: 'conflict';
  original: string; // when schema is in conflict we return a string representation
}

export interface InvalidValue {
  type: PropertyType;
  status: 'invalid';
  original: string; // when not of the good type we return a string representation (string[] fall in this category)
}

export interface MissingValue {
  type: PropertyTypeName;
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
  isVirtual: boolean;
}

export interface LkItem {
  id: string;
  data: LkItemData;
}

// LkNode
export interface IGeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface IGeoData {
  original?: IGeoCoordinates; // defined if geo coordinates were found in the node properties
  current?: IGeoCoordinates;
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
  statistics?: LkNodeStatistics; // defined if withDegree or withDigest was set to true in the request
  geo: IGeoData;
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
export interface IVizNodeInfo {
  id: string;
  attributes: {
    // The coordinates can be set to null when a layout was never applied to the node.
    x: number | null;
    y: number | null;
    layoutable: boolean;
    selected?: boolean; // in expand, frontend has to pass VizNode to ogma without selected attribute
  };
  data: {
    geo: IGeoData;
  };
}

export interface IVizEdgeInfo {
  id: string;
  attributes: {
    selected?: boolean; // in expand, frontend has to pass VizEdge to ogma without selected attribute
  };
}

export type VizNode = LkNode & IVizNodeInfo;
export type VizEdge = LkEdge & IVizEdgeInfo;

// WidgetNode & WidgetEdge
export interface WidgetNodeInfo {
  attributes: {
    x: number;
    y: number;
    color?: string[];
    radius?: number;
    shape?: OgmaNodeShape;
    icon?: IStyleIcon;
    image?: IStyleImage;
    text: {content: string};
  };
}

export interface WidgetEdgeInfo {
  attributes: {
    color?: string;
    shape?: OgmaEdgeShape;
    width?: number;
    text: {content: string};
  };
}

export type WidgetNode = LkNode & WidgetNodeInfo;
export type WidgetEdge = LkEdge & WidgetEdgeInfo;
