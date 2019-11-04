/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-01.
 */

import {GenericObject} from '../api/commonTypes';

import {FetchConfig} from './types';

export enum LkErrorKey {
  // Not a server error
  CONNECTION_REFUSED = 'connection_refused',
  UNAUTHORIZED = 'unauthorized',
  DATA_SOURCE_UNAVAILABLE = 'dataSource_unavailable',
  GUEST_DISABLED = 'guest_disabled',
  FORBIDDEN = 'forbidden',
  NOT_FOUND = 'not_found',
  BAD_GRAPH_REQUEST = 'bad_graph_request',
  GRAPH_REQUEST_TIMEOUT = 'graph_request_timeout',
  CONSTRAINT_VIOLATION = 'constraint_violation',

  ALREADY_EXIST = 'already_exists',
  GROUP_EXISTS = 'group_exists',
  CANNOT_DELETE_NON_EMPTY_FOLDER = 'folder_deletion_failed',
  CANNOT_READ = 'cannot_read',
  ILLEGAL_SOURCE_STATE = 'illegal_source_state',
  MALFORMED_QUERY_TEMPLATE = 'malformed_query_template',
  NOT_OWNED = 'not_owned',
  NOT_SUPPORTED = 'not_supported',
  GRAPH_UNREACHABLE = 'graph_unreachable',
  WRITE_FORBIDDEN = 'write_forbidden'
}

/**
 * Basic error to be extended by custom errors
 */
export interface LkError<K extends LkErrorKey = LkErrorKey> {
  key: K;
  message: string;
}

export class Response<B> {
  body: B;
  status: number;
  header: GenericObject;
  constructor(options: {body: B; status?: number; header?: GenericObject}) {
    this.body = options.body;
    this.status = options.status || 0;
    this.header = options.header || {};
  }

  public isSuccess(): this is Exclude<this, Response<LkError>> {
    return (
      this.status >= 200 &&
      this.status < 300 &&
      !(((this.body as unknown) as LkError).key in LkErrorKey)
    );
  }

  public isAnyError(): this is Extract<this, Response<LkError>> {
    return !this.isSuccess();
  }

  public isError<E extends LkErrorKey>(key: E): this is Extract<this, Response<LkError<E>>> {
    return ((this.body as unknown) as LkError).key === key;
  }
}

/**
 * This is a trick so that:
 * in `const name = ErrorResponses<LkErrorKey.FORBIDDEN, LkErrorKey.UNAUTHORIZED>`
 * the type of name is evaluated to `Response<Forbidden> | Response<Unauthorized>`
 */
export type ErrorResponses<T extends LkErrorKey> = T extends unknown
  ? Response<LkErrorKeyToInterface[T]>
  : Response<LkErrorKeyToInterface[T]>;

/**
 * Every error can carry some payload
 */
// TODO check if all error are used and carry the correct payload
export interface ConnectionRefused extends LkError<LkErrorKey.CONNECTION_REFUSED> {
  fetchConfig: FetchConfig;
}
export interface Unauthorized extends LkError<LkErrorKey.UNAUTHORIZED> {}
export interface DataSourceUnavailable extends LkError<LkErrorKey.DATA_SOURCE_UNAVAILABLE> {}
export interface GuestDisabled extends LkError<LkErrorKey.GUEST_DISABLED> {}
export interface Forbidden extends LkError<LkErrorKey.FORBIDDEN> {}
export interface NotFound extends LkError<LkErrorKey.NOT_FOUND> {}
export interface BadGraphRequest extends LkError<LkErrorKey.BAD_GRAPH_REQUEST> {}
export interface GraphRequestTimeout extends LkError<LkErrorKey.GRAPH_REQUEST_TIMEOUT> {}
export interface ConstraintViolation extends LkError<LkErrorKey.CONSTRAINT_VIOLATION> {}

export interface AlreadyExists extends LkError<LkErrorKey.ALREADY_EXIST> {}
export interface GroupExists extends LkError<LkErrorKey.GROUP_EXISTS> {}
export interface CannotDeleteNonEmptyFolder
  extends LkError<LkErrorKey.CANNOT_DELETE_NON_EMPTY_FOLDER> {}
export interface CannotRead extends LkError<LkErrorKey.CANNOT_READ> {}
export interface IllegalSourceState extends LkError<LkErrorKey.ILLEGAL_SOURCE_STATE> {}
export interface MalformedQueryTemplate extends LkError<LkErrorKey.MALFORMED_QUERY_TEMPLATE> {
  highlight: {
    offset: number;
    length?: number;
  };
}
export interface NotOwned extends LkError<LkErrorKey.NOT_OWNED> {}
export interface NotSupported extends LkError<LkErrorKey.NOT_SUPPORTED> {}
export interface GraphUnreachable extends LkError<LkErrorKey.GRAPH_UNREACHABLE> {}
export interface WriteForbidden extends LkError<LkErrorKey.WRITE_FORBIDDEN> {}

// Mapping from LkErrorKey to LkError, it's used by `ErrorResponses`
export type LkErrorKeyToInterface = {
  [LkErrorKey.CONNECTION_REFUSED]: ConnectionRefused;
  [LkErrorKey.UNAUTHORIZED]: Unauthorized;
  [LkErrorKey.DATA_SOURCE_UNAVAILABLE]: DataSourceUnavailable;
  [LkErrorKey.GUEST_DISABLED]: GuestDisabled;
  [LkErrorKey.FORBIDDEN]: Forbidden;
  [LkErrorKey.NOT_FOUND]: NotFound;
  [LkErrorKey.BAD_GRAPH_REQUEST]: BadGraphRequest;
  [LkErrorKey.GRAPH_REQUEST_TIMEOUT]: GraphRequestTimeout;
  [LkErrorKey.CONSTRAINT_VIOLATION]: ConstraintViolation;

  [LkErrorKey.ALREADY_EXIST]: AlreadyExists;
  [LkErrorKey.GROUP_EXISTS]: GroupExists;
  [LkErrorKey.CANNOT_DELETE_NON_EMPTY_FOLDER]: CannotDeleteNonEmptyFolder;
  [LkErrorKey.CANNOT_READ]: CannotRead;
  [LkErrorKey.ILLEGAL_SOURCE_STATE]: IllegalSourceState;
  [LkErrorKey.MALFORMED_QUERY_TEMPLATE]: MalformedQueryTemplate;
  [LkErrorKey.NOT_OWNED]: NotOwned;
  [LkErrorKey.NOT_SUPPORTED]: NotSupported;
  [LkErrorKey.GRAPH_UNREACHABLE]: GraphUnreachable;
  [LkErrorKey.WRITE_FORBIDDEN]: WriteForbidden;
};
