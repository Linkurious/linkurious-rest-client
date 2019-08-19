/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

import {IDataSourceParams} from './Model';

// Create
export interface ICreateCustomActionParams extends IDataSourceParams {
    name: string,
    urlTemplate: string,
    description?: string
}
export interface ICreateCustomActionResponse extends ICustomAction {}

// Delete
export interface IDeleteCustomActionParams extends IDataSourceParams {
    id: number
}

// Update
export interface IUpdateCustomActionParams extends IDataSourceParams {
    id: number,
    name?: string,
    urlTemplate?: string,
    description?: string
}
export interface IUpdateCustomActionResponse extends ICustomAction {}

// Get
export interface IGetCustomActionsParams extends IDataSourceParams {}
export interface IGetCustomActionsResponse{
    [index: number]: ICustomAction
}

// Entities
export interface ICustomAction {
    id: number,
    name: string,
    urlTemplate: string,
    description?: string,
    sharing: CustomActionSharing,
    type: CustomActionType,
    elements: CustomActionElement[]
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
export interface CustomActionElement {
    type: CustomActionElementType,
    value: string,
    start: number,
    end: number,
    variable?: string,
    label?: string,
    property?: string
}
export enum CustomActionElementType {
    CA_LITERAL = 'ca-literal',
    CA_EXPRESSION = 'ca-expression'
}
