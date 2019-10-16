/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-01.
 */

import {GenericObject} from "./commonTypes";
import {FetchConfig} from "./Module";

export enum LkErrorKey {
  BAD_FETCH_CONFIG = 'bad_fetch_config', // formerly 'state_error'
  DATA_SOURCE_UNAVAILABLE = 'dataSource_unavailable',
  CONNECTION_REFUSED = 'connection_refused', // formerly 'communication_error'
  CLIENT_ERROR = 'client_error', // not used anymore

  BAD_GRAPH_REQUEST = 'bad_graph_request',
  CONSTRAINT_VIOLATION = 'constraint_violation',
  FORBIDDEN = 'forbidden',
  GRAPH_REQUEST_TIMEOUT = 'graph_request_timeout',
  GRAPH_UNREACHABLE = 'graph_unreachable',
  GROUP_EXISTS = 'group_exists',
  GUEST_DISABLED = 'guest_disabled',
  INVALID_PARAMETER = 'invalid_parameter',
  NOT_FOUND = 'not_found',
  UNAUTHORIZED = 'unauthorized',
  WRITE_FORBIDDEN = 'write_forbidden',
  CANCELLED = 'cancelled'
}

// Helper to write less times `LkResponse` as a wrapper in RC methods:
// this Responses<IGetSomethingResponse | Unauthorized | Forbidden>
// evaluates to LkResponse<IGetSomethingResponse> | LkResponse<Unauthorized> | LkResponse<Forbidden>
// it also includes LkResponse of BadFetchConfig, DataSourceUnavailable and ConnectionRefused
// TODO: add INTERNAL_SERVER_ERROR??
// TODO: rename and group BadFetchConfig, DataSourceUnavailable and ConnectionRefused??
export type Responses<T> = (T extends unknown ? LkResponse<T> : LkResponse<T>) |
  LkResponse<BadFetchConfig> |
  LkResponse<DataSourceUnavailable> |
  LkResponse<ConnectionRefused>

export class LkResponse<B = unknown>{
  body: B;
  status: number;
  header: GenericObject<string>;
  constructor(props: { body: B; status?: number; header?: GenericObject<string>; }) {
    this.body = props.body;
    this.status = props.status || 0;
    this.header = props.header || {};
  }
  public isSuccess(): this is Exclude<this, LkResponse<ILkError>> {
    return !((this.body as unknown as ILkError).key in LkErrorKey);
  }
  public isAnyError(): this is Extract<this, LkResponse<ILkError>> {
    return (this.body as unknown as ILkError).key in LkErrorKey;
  }
  // TODO: write this method as non static
  // FYI This does not work: `public isError<E extends LkErrorKey>(key: E): this is Extract<this, LkResponse<ILkError<E>>>`
  // Might work using a type that holds all the possible errors instead of `this`
  public static isError<R extends LkResponse, E extends LkErrorKey>(response: R, key: E): response is Extract<R, LkResponse<ILkError<E>>> {
    return (response.body as unknown as ILkError).key === key;
  }
}

export interface ILkError<K = LkErrorKey> {
  key: K;
  message: string; // english message of the error
}

// Client errors, thrown before performing the request
export interface BadFetchConfig extends ILkError<LkErrorKey.BAD_FETCH_CONFIG> {
  rawFetchConfig: FetchConfig
}
export interface ConnectionRefused extends ILkError<LkErrorKey.CONNECTION_REFUSED> {
  fetchConfig: FetchConfig
}
export interface DataSourceUnavailable extends ILkError<LkErrorKey.DATA_SOURCE_UNAVAILABLE> {}

export interface BadGraphRequest extends ILkError<LkErrorKey.BAD_GRAPH_REQUEST> {}
export interface InvalidParameter extends ILkError<LkErrorKey.INVALID_PARAMETER> {}
export interface Unauthorized extends ILkError<LkErrorKey.UNAUTHORIZED> {}
export interface Forbidden extends ILkError<LkErrorKey.FORBIDDEN> {}
export interface NotFound extends ILkError<LkErrorKey.NOT_FOUND> {}
