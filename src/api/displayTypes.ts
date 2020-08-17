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

export interface IBaseSelector {
  type: SelectorType;
  input?: string[];
  value?: IRangeValues | number | string | boolean;
}

export interface ISelectorNoValue extends IBaseSelector {
  type: SelectorType.NO_VALUE;
  itemType: string;
  input: string[];
}

export interface ISelectorNaN extends IBaseSelector {
  type: SelectorType.NAN;
  itemType: string;
  input: string[];
}

export interface ISelectorAny extends IBaseSelector {
  type: SelectorType.ANY;
  itemType?: string; // optional only if type='any'
  input: undefined;
}

export interface ISelectorRange extends IBaseSelector {
  type: SelectorType.RANGE;
  itemType: string;
  input: string[];
  value: IRangeValues;
}

export interface ISelectorIs extends IBaseSelector {
  type: SelectorType.IS;
  itemType: string;
  input: string[];
  value: number | string | boolean;
}

export type ItemSelector =
  | ISelectorAny
  | ISelectorIs
  | ISelectorNoValue
  | ISelectorNaN
  | ISelectorRange;

export interface IRangeValues {
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

export interface IStyleColor {
  type: 'auto';
  input: string[];
  ignoreCase?: boolean;
}

export interface IStyleIcon {
  content?: string | number;
  font?: string;
  color?: string;
  scale?: number;
  minVisibleSize?: number;
}

export interface IImageDataValue {
  type: 'data';
  path: string[];
}

export interface IStyleImage {
  url?: string | IImageDataValue;
  scale?: number;
  fit?: boolean;
  tile?: boolean;
  minVisibleSize?: number;
}

export interface INodeStyle {
  size?: string | number;
  color?: string | IStyleColor;
  icon?: string | number | IStyleIcon;
  image?: string | IStyleImage;
  shape?: OgmaNodeShape;
}

export interface IEdgeStyle {
  color?: string | IStyleColor;
  width?: string | number;
  shape?: OgmaEdgeShape;
}

export interface IEdgeGroupStyle extends IEdgeStyle {
  color?: string;
}

export interface IStyleRule<T extends INodeStyle | IEdgeStyle> extends IBaseSelector {
  index: number;
  itemType?: string;
  style: T;
}

export interface IStyles {
  node: Array<IStyleRule<INodeStyle>>;
  edge: Array<IStyleRule<IEdgeStyle>>;
}

export interface IDataSourceDefaultStyles extends IStyles {
  edgeGroup: IEdgeGroupStyle;
}

export interface ICaption {
  active: boolean;
  displayName: boolean;
  properties: string[];
}

export interface ICaptions {
  nodes: GenericObject<ICaption>;
  edges: GenericObject<ICaption>;
}
