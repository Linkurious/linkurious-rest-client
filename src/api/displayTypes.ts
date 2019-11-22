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

export interface BaseSelector {
  type: SelectorType;
  input?: string[];
  value?: RangeValues | number | string | boolean;
}

export interface SelectorNoValue extends BaseSelector {
  type: SelectorType.NO_VALUE;
  itemType: string;
  input: string[];
}

export interface SelectorNaN extends BaseSelector {
  type: SelectorType.NAN;
  itemType: string;
  input: string[];
}

export interface SelectorAny extends BaseSelector {
  type: SelectorType.ANY;
  itemType?: string; // optional only if type='any'
  input: undefined;
}

export interface SelectorRange extends BaseSelector {
  type: SelectorType.RANGE;
  itemType: string;
  input: string[];
  value: RangeValues;
}

export interface SelectorIs extends BaseSelector {
  type: SelectorType.IS;
  itemType: string;
  input: string[];
  value: number | string | boolean;
}

export type ItemSelector = SelectorAny | SelectorIs | SelectorNoValue | SelectorNaN | SelectorRange;

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
}

export interface StyleIcon {
  content?: string | number;
  font?: string;
  color?: string;
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

export interface IStyleRule<T extends NodeStyle | EdgeStyle> extends BaseSelector {
  index: number;
  itemType?: string;
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
