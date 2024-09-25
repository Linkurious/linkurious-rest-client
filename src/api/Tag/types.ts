/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2024
 *
 * - Created on 2024-06-04.
 */
import {DeletableUser, IDataSourceParams} from '../commonTypes';
import {GraphQuery} from '../GraphQuery';

export interface Tag {
  id: number;
  name: string;
  sourceKey: string;
  uuid: string;
  color: string;
  owner: DeletableUser;
  createdAt: Date;
}

export interface TagWithAssociatedQueries {
  id: number;
  name: string;
  color: string;
  associatedQueriesCount: number;
  associatedQueries: GraphQuery[];
  createdAt: Date;
}

export interface CreateTagParams extends IDataSourceParams {
  name: string;
  color: string;
  uuid?: string;
}

export interface UpdateTagParams extends Partial<Pick<Tag, 'name' | 'color'>>, IDataSourceParams {
  id: number;
}

export interface DeleteTagParams extends IDataSourceParams {
  id: number;
}

export interface GetTagsParams extends IDataSourceParams {}

export interface GetTagsWithAssociatedQueries extends IDataSourceParams {}
