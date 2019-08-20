/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

// Create
export interface ICreateCustomActionParams {
    sourceKey: string;
    name: string;
    urlTemplate: string;
    description?: string;
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
export interface IGetCustomActionsResponse{
    [index: number]: ICustomAction;
}

// Entities
export interface ICustomAction {
    sourceKey: string;
    id: number;
    name: string;
    urlTemplate: string;
    description?: string;
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
export enum CustomActionVariable {
    VISUALIZATION = 'visualization',
    SOURCEKEY = 'sourceKey',
    NODE = 'node',
    EDGE = 'edge',
    NODESET = 'nodeset',
    EDGESET = 'edgeset'
}
export interface CustomActionElement {
    type: CustomActionElementType;
    value: string;
    start: number;
    end: number;
    variable?: CustomActionVariable;
    label?: string;
    property?: string;
}
export enum CustomActionElementType {
    CA_LITERAL = 'ca-literal',
    CA_EXPRESSION = 'ca-expression'
}
