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

export interface ItemSelector {
  type: SelectorType;
  itemType: string;
  input?: string[];
  value?: RangeValues | number | string | boolean;
}

export interface RangeValues {
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
  paletteName?: string;
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

export interface IStyleRule<T extends NodeStyle | EdgeStyle> extends ItemSelector {
  index: number;
  style: T;
}

export interface Styles {
  node: Array<IStyleRule<NodeStyle>>;
  edge: Array<IStyleRule<EdgeStyle>>;
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
