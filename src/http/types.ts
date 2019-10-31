/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-01.
 */

import {SuperAgentStatic} from 'superagent';

import {IFullUser} from '../api/User';
import {IUserDataSource} from '../api/DataSource';
import {ErrorListener} from '../errorListener';

import {LkErrorKey} from './response';

/**
 * Interfaces for Request class
 */
export interface RawFetchConfig {
  errors?: LkErrorKey[];
  url: string;
  method: 'GET' | 'DELETE' | 'POST' | 'PUT' | 'PATCH';
  params?: Record<string, unknown>;
}

export interface FetchConfig {
  url: string;
  method: 'GET' | 'DELETE' | 'POST' | 'PUT' | 'PATCH';
  body: Record<string, unknown>;
}

export interface ClientState {
  user?: IFullUser;
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
