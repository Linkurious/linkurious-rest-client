/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

import {DeletableUser, IDataSourceParams, PersistedItem, SharingOptions} from '../commonTypes';

export enum CustomActionType {
  NON_GRAPH = 'non-graph',
  NODE = 'node',
  EDGE = 'edge',
  NODESET = 'nodeset',
  EDGESET = 'edgeset'
}

export enum CustomActionVariable {
  BASE_URL = 'baseurl',
  PAGE = 'page',
  VISUALIZATION = 'visualization',
  ALERT = 'alert',
  CASE = 'case',
  SOURCE_KEY = 'sourcekey',
  NODE = 'node',
  EDGE = 'edge',
  NODE_SET = 'nodeset',
  EDGE_SET = 'edgeset'
}

export type CustomActionElement =
  | {
      value: string;
      type: 'ca-literal';
    }
  | {
      value: string;
      type: 'ca-expression';
      variable:
        | CustomActionVariable.VISUALIZATION
        | CustomActionVariable.ALERT
        | CustomActionVariable.CASE
        | CustomActionVariable.SOURCE_KEY
        | CustomActionVariable.PAGE
        | CustomActionVariable.BASE_URL;
    }
  | {
      value: string;
      type: 'ca-expression';
      variable:
        | CustomActionVariable.NODE_SET
        | CustomActionVariable.EDGE_SET
        | CustomActionVariable.NODE
        | CustomActionVariable.EDGE;
      itemType?: string;
      property?: string;
    };

export interface ParsedCustomAction {
  type: CustomActionType;
  elements: CustomActionElement[];
}

export enum CustomActionRight {
  MANAGE = 'manage',
  READ = 'read'
}

export enum CustomActionParsingErrorKey {
  UNCLOSED_EXPRESSION = 'unclosed-expression',
  EMPTY_EXPRESSION = 'empty-expression',
  INVALID_EXPRESSION_SYNTAX = 'invalid-expression-syntax',
  INVALID_VARIABLE = 'invalid-variable',
  INVALID_SEMANTIC = 'invalid-semantic',
  UNKNOWN_NODE_CATEGORY = 'unknown-node-category',
  UNKNOWN_EDGE_TYPE = 'unknown-edge-type',
  NO_EXPRESSIONS = 'no-expressions',
  INVALID_TEMPLATE_COMBINATION = 'invalid-template-combination',
  INCOMPATIBLE_RESTRICTIONS = 'incompatible-restrictions'
}

export type CustomActionParsingError = {
  start: number;
  end: number;
} & (
  | {
      key: CustomActionParsingErrorKey.INVALID_SEMANTIC;
      variable: CustomActionVariable;
      unsupportedRestriction: 'type' | 'property';
    }
  | {
      key: CustomActionParsingErrorKey.INCOMPATIBLE_RESTRICTIONS;
      variable: CustomActionVariable.NODE | CustomActionVariable.EDGE;
      restrictionType: 'category' | 'type';
    }
  | {
      key: CustomActionParsingErrorKey.INVALID_TEMPLATE_COMBINATION;
      variables: [CustomActionVariable, CustomActionVariable];
    }
  | {
      key: Exclude<
        CustomActionParsingErrorKey,
        | CustomActionParsingErrorKey.INVALID_SEMANTIC
        | CustomActionParsingErrorKey.INCOMPATIBLE_RESTRICTIONS
        | CustomActionParsingErrorKey.INVALID_TEMPLATE_COMBINATION
      >;
    }
);

export interface CustomAction extends PersistedItem, SharingOptions {
  sourceKey: string;
  name: string;
  urlTemplate: string;
  description: string;
  parsedTemplate: ParsedCustomAction;
  right: CustomActionRight;
  owner: {
    name: string;
    email: string;
  };
  lastEditor: DeletableUser;
  lastShareEditor: DeletableUser;
}

export interface ICreateCustomActionParams extends IDataSourceParams, SharingOptions {
  name: string;
  urlTemplate: string;
  description?: string;
}

export interface IDeleteCustomActionParams extends IDataSourceParams {
  id: number;
}

export interface IUpdateCustomActionParams extends Partial<ICreateCustomActionParams> {
  id: number;
}
