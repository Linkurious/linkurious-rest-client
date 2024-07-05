/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2024
 *
 * - Created on 2024-06-04.
 */
import {DeletableUser, IDataSourceParams} from '../commonTypes';

export interface Tag {
  id: number;
  name: string;
  sourceKey: string;
  uuid: string;
  color: string;
  owner: DeletableUser;
}

export interface CreateTagParams extends IDataSourceParams {
  name: string;
  color: string;
  uuid?: string;
}

export interface GetTagsParams extends IDataSourceParams {}
