/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-05-16.
 */

// TS2019-DONE

export interface IPersistedItem {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export type FolderChildren<T, N extends string> = Array<IFolder<T, N> | (T & {type: N})>;

export interface IFolder<T, N extends string> {
  id: number;
  title: string;
  type: string;
  children: FolderChildren<T, N>;
}
