/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2024
 *
 * - Created on 2024-06-04.
 */
import {IDataSourceParams} from '../commonTypes';

export interface Tag {
  id: number;
  name: string;
  sourceKey: string;
  uuid: string;
}

export interface CreateTagParams extends IDataSourceParams {
  name: string;
  sourceKey: string;
  uuid?: string;
}

export interface GetTagsParams extends IDataSourceParams {}
