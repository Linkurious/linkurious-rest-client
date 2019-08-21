/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

// TS2019-DONE

// Create
export interface ICreateCustomActionParams {
    sourceKey: string;
    name: string;
    urlTemplate: string;
    description: string;
    sharing: CustomActionSharing
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
}
export interface IUpdateCustomActionResponse extends ICustomAction {}

// Get
export interface IGetCustomActionsParams {
    sourceKey: string;
}
export type IGetCustomActionsResponse = ICustomAction[]

// Entities
export interface ICustomAction {
    sourceKey: string;
    id: number;
    name: string;
    urlTemplate: string;
    description: string;
    sharing: CustomActionSharing;
    type: CustomActionType;
    elements: CustomActionElement[];
}
export enum CustomActionSharing {
    PRIVATE = 'private',
    SOURCE = 'source'
}
export enum CustomActionType {
    NONE = 'none',
    NON_GRAPH = 'non-graph',
    NODE = 'node',
    EDGE = 'edge',
    NODESET = 'nodeset',
    EDGESET = 'edgeset'
}
export type CustomActionElement = {
    value: string;
    start: number;
    end: number;
} & (
    {
        type: 'ca-literal';
    } | {
        type: 'ca-expression';
        variable: 'visualization' | 'sourceKey';
    } | {
        type: 'ca-expression';
        variable: 'nodeset' | 'edgeset';
        label?: string;
    } | {
        type: 'ca-expression',
        variable: 'node' | 'edge'
        label?: string;
        property?: string;
    }
)
