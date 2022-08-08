import {IDataSourceParams} from '../commonTypes';

export interface ICreateSpaceParams extends IDataSourceParams {
  title: string;
  description: string;
  sharedWithGroups: number[];
}

export interface ISpace extends ICreateSpaceParams {
  id: number;
  createdAt: string;
  updatedAt: string;
}
