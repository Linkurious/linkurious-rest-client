/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

import {IDataSourceParams, PersistedItem} from '../commonTypes';

// Create
export interface ICreateCustomActionParams extends IDataSourceParams {
  name: string;
  urlTemplate: string;
  description: string;
  sharing: CustomActionSharing;
}
export interface CreateCustomActionResponse extends CustomAction {}

// Delete
export interface IDeleteCustomActionParams extends IDataSourceParams {
  id: number;
}

// Update
export interface IUpdateCustomActionParams extends IDataSourceParams {
  id: number;
  name?: string;
  urlTemplate?: string;
  description?: string;
  sharing?: CustomActionSharing;
}

export interface UpdateCustomActionResponse extends CustomAction {}

// Get
export interface IGetCustomActionsParams extends IDataSourceParams {}

export type GetCustomActionsResponse = CustomAction[];

// Types
export interface CustomAction extends PersistedItem {
  sourceKey: string;
  name: string;
  urlTemplate: string;
  description: string;
  sharing: CustomActionSharing;
  parsedTemplate: ParsedCustomAction;
  right: CustomActionRight;
}

export enum CustomActionRight {
  OWNER = 'owner',
  READ = 'read'
}

export interface ParsedCustomAction {
  type: CustomActionType;
  elements: CustomActionElement[];
  itemType: string;
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
  | {
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
      itemType?: string;
    }
  | {
      value: string;
      type: 'ca-expression';
      variable: 'node' | 'edge';
      itemType?: string;
      property?: string;
    };
