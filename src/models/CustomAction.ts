/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

// TS2019-DONE

import {IDataSourceParams} from './DataSource';
import {IPersistedItem} from './Model';

// Create
export interface ICreateCustomActionParams extends IDataSourceParams {
    name: string;
    urlTemplate: string;
    description: string;
    sharing: CustomActionSharing;
}
export interface ICreateCustomActionResponse extends ICustomAction {}

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

export interface IUpdateCustomActionResponse extends ICustomAction {}

// Get
export interface IGetCustomActionsParams extends IDataSourceParams {}

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
