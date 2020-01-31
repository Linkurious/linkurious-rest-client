/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

import {IDataSourceParams, PersistedItem} from '../commonTypes';

export enum CustomActionType {
  NON_GRAPH = 'non-graph',
  NODE = 'node',
  EDGE = 'edge',
  NODESET = 'nodeset',
  EDGESET = 'edgeset'
}

export enum CustomActionVariable {
  BASE_URL = 'baseurl',
  VISUALIZATION = 'visualization',
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
        | CustomActionVariable.SOURCE_KEY
        | CustomActionVariable.BASE_URL;
    }
  | {
      value: string;
      type: 'ca-expression';
      variable: CustomActionVariable.NODE_SET | CustomActionVariable.EDGE_SET;
      itemType?: string;
    }
  | {
      value: string;
      type: 'ca-expression';
      variable: CustomActionVariable.NODE | CustomActionVariable.EDGE;
      itemType?: string;
      property?: string;
    };

export interface ParsedCustomAction {
  type: CustomActionType;
  elements: CustomActionElement[];
}

export enum CustomActionSharingMode {
  PRIVATE = 'private',
  SOURCE = 'source'
}

export enum CustomActionRight {
  OWNER = 'owner',
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
    }
  | {
      key: CustomActionParsingErrorKey.INCOMPATIBLE_RESTRICTIONS;
      variable: CustomActionVariable.NODE | CustomActionVariable.EDGE;
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

export interface CustomAction extends PersistedItem {
  sourceKey: string;
  name: string;
  urlTemplate: string;
  description: string;
  sharing: CustomActionSharingMode;
  parsedTemplate: ParsedCustomAction;
  right: CustomActionRight;
}

export interface ICreateCustomActionParams extends IDataSourceParams {
  name: string;
  urlTemplate: string;
  description?: string;
  sharing: CustomActionSharingMode;
}

export interface IDeleteCustomActionParams extends IDataSourceParams {
  id: number;
}

export interface IUpdateCustomActionParams extends Partial<ICreateCustomActionParams> {
  id: number;
}
