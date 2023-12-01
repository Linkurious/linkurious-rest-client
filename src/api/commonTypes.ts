/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-30.
 */

export interface GenericObject<T = unknown> {
  [key: string]: T;
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export interface PaginatedResponse<T> {
  totalCount: number;
  items: T[];
}

export interface PaginationClause {
  offset?: number;
  limit?: number;
}

export interface PaginationGenerator {
  (pageSize: number): PaginationClause;
}

export interface IDataSourceParams {
  sourceKey?: string;
}

export interface IGetSubGraphParams extends IDataSourceParams {
  edgesTo?: string[];
  withDigest?: boolean;
  withDegree?: boolean;
}

export enum SharingMode {
  PRIVATE = 'private',
  SOURCE = 'source',
  GROUPS = 'groups'
}

export interface SharingOptions {
  sharing: SharingMode;
  sharedWithGroups?: number[]; // defined only if sharing='groups'
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

/*
  Removes '&' from T
  input: DummyCopy<{a:A; b?:B; c:C} & {d?: D}>
  output: {a:A; b?:B; c:C; d?: D}
 */
export type DummyCopy<T> = {[K in keyof T]: T[K]};

/**
 * Set as required the properties K in T
 */
export type RequiredProps<T, K extends keyof T> = DummyCopy<T & {[P in K]-?: T[P]}>;

export enum CurrencyFormat {
  SYMBOL_COMMAS_DOT = '[Symbol] #,###.##',
  SYMBOL_COMMAS = '[Symbol] #,###',
  DOTS_COMMA_SYMBOL = '#.###,## [Symbol]',
  DOTS_SYMBOL = '#.### [Symbol]',
  SPACES_COMMA_SYMBOL = '# ###,## [Symbol]',
  SPACES_SYMBOL = '# ### [Symbol]'
}
export interface ICurrencyOptions {
  type: 'currency';
  format: CurrencyFormat;
  symbol?: string;
}

export interface CommentMention {
  position: number;
  length: number;
  user: MentionedUser;
}

export interface DeletableUser {
  username: string;
  email: string;
}

export interface MentionedUser extends DeletableUser {
  hasAccess: boolean;
}
