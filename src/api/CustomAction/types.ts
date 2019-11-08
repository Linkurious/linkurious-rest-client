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
  description: string;
  sharing: CustomActionSharingMode;
}

export interface IDeleteCustomActionParams extends IDataSourceParams {
  id: number;
}

export interface IUpdateCustomActionParams extends Partial<ICreateCustomActionParams> {
  id: number;
}
