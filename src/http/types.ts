/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-01.
 */

import {SuperAgentStatic, Response} from 'superagent';

import {User} from '../api/User';
import {DataSourceUserInfo} from '../api/DataSource';
import {ErrorListener} from '../errorListener';
import {GenericObject} from '../api/commonTypes';

import {LkErrorKey} from './response';

/**
 * Interfaces for Request class
 */
export interface RawFetchConfig<
  E extends LkErrorKey = LkErrorKey,
  P extends Record<never, never> = Record<never, never>
> {
  errors?: E[];
  url: string;
  method: 'GET' | 'DELETE' | 'POST' | 'PUT' | 'PATCH';
  params?: P;
}

export interface SendBeaconConfig<
    E extends LkErrorKey = LkErrorKey,
    P extends Record<never, never> = Record<never, never>
> extends RawFetchConfig<E, P> {
  // Only the post method is supported, see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon
  method: 'POST';
}

export interface FetchConfig {
  url: string;
  method: 'GET' | 'DELETE' | 'POST' | 'PUT' | 'PATCH';
  body?: GenericObject;
  query: GenericObject;
}

export interface ClientState {
  user?: User;
  currentSource?: DataSourceUserInfo;
  guestMode?: boolean;
  sources?: DataSourceUserInfo[];
}

export interface ModuleProps {
  readonly baseUrl: string;
  readonly agent: SuperAgentStatic;
  readonly clientState: ClientState;
  readonly dispatchError: ErrorListener['dispatchError'];
}

// We define our own type because Response declares body as any
export type SuperAgentResponse = Omit<Response, 'body'> & {
  body: GenericObject<unknown> | undefined;
};
