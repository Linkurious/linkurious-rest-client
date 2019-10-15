/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-01.
 */

import {GenericObject} from "./commonTypes";

export enum LkErrorKey {
  CONNECTION_REFUSED = 'connection_refused', // formerly 'communication_error'
  BAD_FETCH_CONFIG = 'bad_fetch_config', // formerly 'state_error'

  BAD_GRAPH_REQUEST = 'bad_graph_request',
  CONSTRAINT_VIOLATION = 'constraint_violation',
  DATA_SOURCE_UNAVAILABLE = 'dataSource_unavailable',
  FORBIDDEN = 'forbidden',
  GRAPH_REQUEST_TIMEOUT = 'graph_request_timeout',
  GRAPH_UNREACHABLE = 'graph_unreachable',
  GROUP_EXISTS = 'group_exists',
  GUEST_DISABLED = 'guest_disabled',
  INVALID_PARAMETER = 'invalid_parameter',
  NOT_FOUND = 'not_found',
  UNAUTHORIZED = 'unauthorized',
  WRITE_FORBIDDEN = 'write_forbidden',
  CANCELLED = 'cancelled',
  CLIENT_ERROR = 'client_error'
}

// Helper to write less times `LkResponse` as a wrapper in RC methods:
// this Responses<IGetSomethingResponse | Unauthorized | Forbidden>
// evaluates to LkResponse<IGetSomethingResponse> | LkResponse<Unauthorized> | LkResponse<Forbidden>
export type Responses<T> = T extends unknown ? LkResponse<T> : LkResponse<T>

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
  public isError<E extends LkErrorKey>(key: E
  ): this is Extract<this, LkResponse<ILkError<E>>> {
    return (this.body as unknown as ILkError).key === key;
  }
}

export interface ILkError<K = LkErrorKey> {
  key: K;
  message: string; // english message of the error
}

export interface BadGraphRequest extends ILkError<LkErrorKey.BAD_GRAPH_REQUEST> {}
export interface InvalidParameter extends ILkError<LkErrorKey.INVALID_PARAMETER> {}
export interface Unauthorized extends ILkError<LkErrorKey.UNAUTHORIZED> {}
export interface Forbidden extends ILkError<LkErrorKey.FORBIDDEN> {}
export interface DataSourceUnavailable extends ILkError<LkErrorKey.DATA_SOURCE_UNAVAILABLE> {}
export interface NotFound extends ILkError<LkErrorKey.NOT_FOUND> {}
export interface ConnectionRefused extends ILkError<LkErrorKey.CONNECTION_REFUSED> {}
