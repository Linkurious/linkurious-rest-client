/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-11-05.
 */

import {GenericObject} from './commonTypes';

export enum SelectorType {
  ANY = 'any',
  NO_VALUE = 'novalue',
  NAN = 'nan',
  RANGE = 'range',
  IS = 'is'
}

export interface RangeValue {
  '<='?: number;
  '<'?: number;
  '>'?: number;
  '>='?: number;
}

export enum OgmaNodeShape {
  CIRCLE = 'circle',
  CROSS = 'cross',
  DIAMOND = 'diamond',
  PENTAGON = 'pentagon',
  SQUARE = 'square',
  STAR = 'star',
  EQUILATERAL = 'equilateral'
}

export enum OgmaEdgeShape {
  LINE = 'line',
  ARROW = 'arrow',
  TAPERED = 'tapered',
  DASHED = 'dashed',
  DOTTED = 'dotted'
}

export interface StyleColor {
  type: 'auto';
  input: string[];
  ignoreCase?: boolean;
}

export interface StyleIcon {
  content?: string | number;
  font?: string;
  color?: string | StyleColor;
  scale?: number;
  minVisibleSize?: number;
}

export interface ImageDataValue {
  type: 'data';
  path: string[];
}

export interface StyleImage {
  url?: string | ImageDataValue;
  scale?: number;
  fit?: boolean;
  tile?: boolean;
  minVisibleSize?: number;
}

export interface NodeStyle {
  size?: string | number;
  color?: string | StyleColor;
  icon?: string | number | StyleIcon;
  image?: string | StyleImage;
  shape?: OgmaNodeShape;
}

export interface EdgeStyle {
  color?: string | StyleColor;
  width?: string | number;
  shape?: OgmaEdgeShape;
}

export interface StyleRule<T extends NodeStyle | EdgeStyle> {
  index: number;
  type: SelectorType;
  itemType?: string;
  input?: string[];
  value?: string | number | boolean | Array<unknown> | RangeValue;
  style: T;
}

export interface Styles {
  node: Array<StyleRule<NodeStyle>>;
  edge: Array<StyleRule<EdgeStyle>>;
}

export interface Caption {
  active: boolean;
  displayName: boolean;
  properties: string[];
}

export interface Captions {
  nodes: GenericObject<Caption>;
  edges: GenericObject<Caption>;
}
