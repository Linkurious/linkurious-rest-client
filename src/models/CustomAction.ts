/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

// TS2019-DONE

import {IPersistedItem} from './Model';

// Create
export interface ICreateCustomActionParams {
  sourceKey: string;
  name: string;
  urlTemplate: string;
  description: string;
  sharing: CustomActionSharing;
}
export interface ICreateCustomActionResponse extends ICustomAction {}

// Delete
export interface IDeleteCustomActionParams {
  sourceKey: string;
  id: number;
}

// Update
export interface IUpdateCustomActionParams {
  sourceKey: string;
  id: number;
  name?: string;
  urlTemplate?: string;
  description?: string;
  sharing?: CustomActionSharing;
}
export interface IUpdateCustomActionResponse extends ICustomAction {}

// Get
export interface IGetCustomActionsParams {
  sourceKey: string;
}
export type IGetCustomActionsResponse = ICustomAction[];

// Types
export interface ICustomAction extends IPersistedItem {
  sourceKey: string;
  name: string;
  urlTemplate: string;
  description: string;
  sharing: CustomActionSharing;
  parsedTemplate: ParsedCustomAction;
}
export interface ParsedCustomAction {
  type: CustomActionType;
  elements: CustomActionElement[];
  label: string;
}
export enum CustomActionSharing {
  PRIVATE = 'private',
  SOURCE = 'source'
}
export enum CustomActionType {
  NON_GRAPH = 'non-graph',
  NODE = 'node',
  EDGE = 'edge',
  NODESET = 'nodeset',
  EDGESET = 'edgeset'
}
export type CustomActionElement =
  {
      value: string;
      type: 'ca-literal';
    }
  | {
      value: string;
      type: 'ca-expression';
      variable: 'visualization' | 'sourceKey';
    }
  | {
      value: string;
      type: 'ca-expression';
      variable: 'nodeset' | 'edgeset';
      label?: string;
    }
  | {
      value: string;
      type: 'ca-expression';
      variable: 'node' | 'edge';
      label?: string;
      property?: string;
    };
