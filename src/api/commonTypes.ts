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

export interface IGetSubGraphParams extends IDataSourceParams {
  edgesTo?: string[];
  withDigest?: boolean;
  withDegree?: boolean;
}

export interface PersistedItem {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export type FolderChildren<T, N extends string> = Array<Folder<T, N> | (T & {type: N})>;

export interface Folder<T, N extends string> {
  id: number;
  title: string;
  type: 'folder';
  children: FolderChildren<T, N>;
}

export interface Tree<T, N extends string> {
  id: -1;
  title: 'root';
  type: 'folder';
  children: FolderChildren<T, N>;
}
