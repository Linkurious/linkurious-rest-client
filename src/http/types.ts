/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-01.
 */

import {SuperAgentStatic} from 'superagent';

import {FullUser} from '../api/User';
import {IUserDataSource} from '../api/DataSource';
import {ErrorListener} from '../errorListener';
import {GenericObject} from '../api/commonTypes';

import {LkErrorKey} from './response';

/**
 * Interfaces for Request class
 */
export interface RawFetchConfig<P extends {} = {}> {
  errors?: LkErrorKey[];
  url: string;
  method: 'GET' | 'DELETE' | 'POST' | 'PUT' | 'PATCH';
  params?: P;
}

export interface FetchConfig {
  url: string;
  method: 'GET' | 'DELETE' | 'POST' | 'PUT' | 'PATCH';
  body?: GenericObject;
  query: GenericObject;
}

export interface ClientState {
  user?: FullUser;
  currentSource?: IUserDataSource;
  guestMode?: boolean;
  sources?: IUserDataSource[];
}

export interface ModuleProps {
  baseUrl: string;
  agent: SuperAgentStatic;
  clientState: ClientState;
  dispatchError: ErrorListener['dispatchError'];
}
