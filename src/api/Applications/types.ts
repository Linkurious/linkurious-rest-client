/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {PersistedItem} from '../commonTypes';

export interface Application extends PersistedItem {
  name: string;
  apiKey: string;
  enabled: boolean;
  groups: number[];
  // TODO PKAR type on merge
  rights: string[];
}

export interface ICreateApplicationParams {
  name: string;
  enabled?: boolean;
  groups: number[];
  rights: string[];
}

export interface IUpdateApplicationParams extends Partial<ICreateApplicationParams> {
  id: number;
}
