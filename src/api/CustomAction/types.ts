/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

import {Diff, IDataSourceParams, PersistedItem} from '../commonTypes';

export enum CustomActionType {
  NON_GRAPH = 'non-graph',
  NODE = 'node',
  EDGE = 'edge',
  NODESET = 'nodeset',
  EDGESET = 'edgeset'
}

export type CustomActionVariable =
  | 'visualization'
  | 'sourcekey'
  | 'node'
  | 'edge'
  | 'nodeset'
  | 'edgeset';

export type CustomActionElement =
  | {
      value: string;
      type: 'ca-literal';
    }
  | {
      value: string;
      type: 'ca-expression';
      variable: 'visualization' | 'sourcekey';
    }
  | {
      value: string;
      type: 'ca-expression';
      variable: 'nodeset' | 'edgeset';
      itemType?: string;
    }
  | {
      value: string;
      type: 'ca-expression';
      variable: 'node' | 'edge';
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
  INVALID_TEMPLATE_COMBINATION = 'invalid-template-combination'
}

export interface CommonCustomActionParsingError {
  key: Diff<
    CustomActionParsingErrorKey,
    CustomActionParsingErrorKey.INVALID_SEMANTIC &
      CustomActionParsingErrorKey.INVALID_TEMPLATE_COMBINATION
  >;
  start: number;
  end: number;
}

export type InvalidTemplateCombinationError = CommonCustomActionParsingError & {
  key: CustomActionParsingErrorKey.INVALID_TEMPLATE_COMBINATION;
  variables: CustomActionVariable[];
};

export type InvalidSemanticError = CommonCustomActionParsingError & {
  key: CustomActionParsingErrorKey.INVALID_SEMANTIC;
  variable: CustomActionVariable;
};

export type CustomActionParsingError =
  | CommonCustomActionParsingError
  | InvalidTemplateCombinationError
  | InvalidSemanticError;

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
