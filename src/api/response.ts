/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-01.
 */

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

export enum LkSuccessKey {
  SUCCESS = 'success'
}

export interface ServerResponse<K> {
  key: K;
  status?: number;
}

export interface Success<N = unknown> extends ServerResponse<LkSuccessKey> {
  key: LkSuccessKey.SUCCESS;
  response: N;
}

export interface ILkError<K = LkErrorKey> extends ServerResponse<K> {
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

export class LkGuards {
  public static isSuccess(o: ServerResponse<LkSuccessKey | LkErrorKey>): o is Success {
    return o.key === LkSuccessKey.SUCCESS;
  }
  // `any` is not good
  public static isError(o: any): o is ILkError<LkErrorKey> {
    return (o.key as LkErrorKey) in LkErrorKey;
  }
  public static isInvalidParameter(o: ServerResponse<LkErrorKey>): o is InvalidParameter {
    return o.key === LkErrorKey.INVALID_PARAMETER;
  }
  public static isConnectionRefused(o: ServerResponse<LkErrorKey>): o is ConnectionRefused {
    return o.key === LkErrorKey.CONNECTION_REFUSED;
  }
}
