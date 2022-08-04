import { SharingOptions } from '../commonTypes';

export interface ICreateSpaceParams extends SharingOptions {
  title: string;
  description: string;
}

export interface ISpace extends ICreateSpaceParams {
  id: number;
  createdAt: string;
  updatedAt: string;
}
