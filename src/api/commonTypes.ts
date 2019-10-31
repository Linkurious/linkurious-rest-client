/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-30.
 */

export interface GenericObject<T = unknown> {
  [key: string]: T;
}

export interface IDataSourceParams {
  sourceKey?: string;
}

export interface IDataSourceRelative {
  dataSourceKey?: string; // I believe this is no longer used
  dataSourceIndex?: number;
}

export interface IPersistedItem {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface IIdentified {
  id: number;
}

export type FolderChildren<T, N extends string> = Array<IFolder<T, N> | (T & {type: N})>;

export interface IFolder<T, N extends string> {
  id: number;
  title: string;
  type: 'folder';
  children: FolderChildren<T, N>;
}

export type RightType = 'read' | 'write' | 'none' | 'do';

export type QueryDialect = 'cypher' | 'gremlin';
