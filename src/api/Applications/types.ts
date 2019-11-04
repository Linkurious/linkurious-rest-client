/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {PersistedItem} from '../commonTypes';

// TODO add type to rights after PKAR is merged
export interface Application extends PersistedItem {
  name: string;
  apiKey: string;
  enabled: boolean;
  groups: number[];
  rights: string[];
}

export type GetApplicationsResponse = Application[];

export interface ICreateApplicationParams {
  name: string;
  enabled?: boolean;
  groups: number[];
  rights: string[];
}

export interface CreateApplicationResponse extends Application {}

export interface IUpdateApplicationParams extends Partial<ICreateApplicationParams> {
  id: number;
}

export interface UpdateApplicationResponse extends Application {}
