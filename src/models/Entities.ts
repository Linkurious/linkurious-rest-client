/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-06-28.
 */

// TS2019-DONE

import { IDateTimeType, IDateType, ISimpleType, IStringType, LkPropertyType } from './Schema';

// Attributes as they arrive from the Create ApiParams

export interface LkRawProperties {
  [key: string]: unknown;
}

export interface LkRawNodeAttributes {
  data: LkRawProperties;
  categories: string[];
}

export interface LkRawEdgeAttributes {
  data: LkRawProperties;
  type: string;
  source: string;
  target: string;
}

// Attributes after being checked by the schema checker

export type LkValidProperty = string | number | boolean | LkDate | LkDateTime;

export interface LkValidProperties {
  [key: string]: LkValidProperty;
}

export interface LkValidNodeAttributes {
  data: LkValidProperties;
  categories: string[];
}

export interface LkValidEdgeAttributes {
  data: LkValidProperties;
  type: string;
  source: string;
  target: string;
}

// Attributes after being decoded by the schema checker

export interface INativeTemporalValue {
  value: number;
}

export interface INativeDate extends INativeTemporalValue {}

export interface INativeDateTime extends INativeTemporalValue {}

export type LkProperty = string | number | boolean | INativeDate | INativeDateTime;

export interface LkProperties {
  [key: string]: LkProperty;
}

export interface LkNodeAttributes {
  data: LkProperties;
  categories: string[];
}

export interface LkEdgeAttributes {
  data: LkProperties;
  type: string;
  source: string;
  target: string;
}

// Nodes and edges after being returned by the Graph DAO
// Note that the graph database can return any property value including objects, string[] and NativeDate

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
  supernode?: boolean;
  supernodeDigest?: LkEdgeDigestItem[];
  supernodeDegree?: number;
  digest?: LkDigestItem[];
  degree?: number;
}

export interface LkNode {
  id: string;
  categories: string[];
  data: LkRawProperties;
  statistics?: LkNodeStatistics;
  tolerateIsoStringAsNativeDate?: boolean;
}

export interface LkEdge {
  id: string;
  type: string;
  source: string;
  target: string;
  data: LkRawProperties;
  tolerateIsoStringAsNativeDate?: boolean;
}

export interface LkSubGraph {
  nodes: LkNode[];
  edges: LkEdge[];
}

// Nodes and edges after being normalized by the schema and being added the read timestamp

export interface LkDate {
  type: 'date';
  value: string; // iso string UTC+0
}

export interface LkDateTime {
  type: 'datetime';
  value: string; // iso string UTC+0
  offsetSeconds?: number;
}

export interface ConflictValue {
  type: LkPropertyType;
  status: 'conflict';
  original: string; // when schema is in conflict we return a string representation
}

export interface InvalidValue {
  type: ISimpleType | IStringType | IDateType | IDateTimeType;
  status: 'invalid';
  original: string; // when not of the good type we return a string representation (string[] fall in this category)
}

export interface MissingValue {
  type: LkPropertyType;
  status: 'missing'; // when mandatory but not there
}

export type LkNormalizedProperty =
  | string
  | number
  | boolean
  | LkDate
  | LkDateTime
  | MissingValue
  | InvalidValue
  | ConflictValue;

export interface LkNormalizedProperties {
  [key: string]: LkNormalizedProperty;
}

export interface LkNormalizedNode {
  id: string;
  categories: string[];
  data: LkNormalizedProperties;
  readAt: number;
  statistics?: LkNodeStatistics;
}

export interface LkNormalizedEdge {
  id: string;
  type: string;
  source: string;
  target: string;
  data: LkNormalizedProperties;
  readAt: number;
}

export interface LkNormalizedSubGraph {
  nodes: LkNormalizedNode[];
  edges: LkNormalizedEdge[];
}
