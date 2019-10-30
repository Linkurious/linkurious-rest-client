/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import { IIdentified, IPersistedItem } from "../commonTypes";

// TODO add type to rights (today enum is in the lke-server)
interface Application extends IPersistedItem {
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

export interface IUpdateApplicationParams extends IIdentified, Partial<ICreateApplicationParams> {}

export interface UpdateApplicationResponse extends Application {}
