/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-01.
 */

import {SuperAgentStatic} from 'superagent';

import {User} from '../api/User';
import {DataSource} from '../api/DataSource';
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
  user?: User;
  currentSource?: DataSource;
  guestMode?: boolean;
  sources?: DataSource[];
}

export interface ModuleProps {
  baseUrl: string;
  agent: SuperAgentStatic;
  clientState: ClientState;
  dispatchError: ErrorListener['dispatchError'];
}
