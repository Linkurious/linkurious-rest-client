/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-01.
 */

import {GenericObject} from "./commonTypes";
import {FetchConfig, RawFetchConfig} from "./Module";

export enum LkErrorKey {
  // Not a server error
  CONNECTION_REFUSED = 'connection_refused',

  // These ones have a class
  ALREADY_EXIST = 'already_exists', // Class: AlreadyExistsError, key: 'constraint_violation'
  BUG = 'bug',
  CANNOT_DELETE_NON_EMPTY_FOLDER = 'folder_deletion_failed', // Class: CantDeleteNonEmptyFolderError
  CANNOT_READ = 'cannot_read', // Class: CantReadError, key: 'forbidden'
  DATA_SOURCE_UNAVAILABLE = 'dataSource_unavailable', // Class: DataSourceUnavailableError
  GRAPH_REQUEST_TIMEOUT = 'graph_request_timeout',
  ILLEGAL_SOURCE_STATE = 'illegal_source_state', // Class: IllegalSourceStateError
  INVALID_PARAMETER = 'invalid_parameter',
  MALFORMED_QUERY_TEMPLATE = 'malformed_query_template',
  NOT_FOUND = 'not_found', // Class: NotFoundError
  NOT_OWNED = 'not_owned', // Class: NotOwnedError, key: 'forbidden'
  NOT_SUPPORTED = 'not_supported', // Class: NotSupportedError

  // These ones are used directly as key
  BAD_GRAPH_REQUEST = 'bad_graph_request', // in Business
  CONSTRAINT_VIOLATION = 'constraint_violation', // in Business
  FORBIDDEN = 'forbidden', // in Access
  GRAPH_UNREACHABLE = 'graph_unreachable', // in Technical
  GUEST_DISABLED = 'guest_disabled', // in Access
  UNAUTHORIZED = 'unauthorized', // in Access
  WRITE_FORBIDDEN = 'write_forbidden', // in Access
}
export type KeyToInterface = {
  [LkErrorKey.CONNECTION_REFUSED]: ConnectionRefused,
  [LkErrorKey.ALREADY_EXIST]: AlreadyExists,
  [LkErrorKey.BUG]: Bug,
  [LkErrorKey.CANNOT_DELETE_NON_EMPTY_FOLDER]: CannotDeleteNonEmptyFolder,
  [LkErrorKey.CANNOT_READ]: CannotRead,
  [LkErrorKey.DATA_SOURCE_UNAVAILABLE]: DataSourceUnavailable,
  [LkErrorKey.GRAPH_REQUEST_TIMEOUT]: GraphRequestTimeout,
  [LkErrorKey.ILLEGAL_SOURCE_STATE]: IllegalSourceState,
  [LkErrorKey.INVALID_PARAMETER]: InvalidParameter,
  [LkErrorKey.MALFORMED_QUERY_TEMPLATE]: MalformedQueryTemplate,
  [LkErrorKey.NOT_FOUND]: NotFound,
  [LkErrorKey.NOT_OWNED]: NotOwned,
  [LkErrorKey.NOT_SUPPORTED]: NotSupported,
  [LkErrorKey.BAD_GRAPH_REQUEST]: BadGraphRequest,
  [LkErrorKey.CONSTRAINT_VIOLATION]: ConstraintViolation,
  [LkErrorKey.FORBIDDEN]: Forbidden,
  [LkErrorKey.GRAPH_UNREACHABLE]: GraphUnreacheable,
  [LkErrorKey.GUEST_DISABLED]: GuestDisabled,
  [LkErrorKey.UNAUTHORIZED]: Unauthorized,
  [LkErrorKey.WRITE_FORBIDDEN]: WriteForbidden
}
// If a new error key is added to the enum `LkErrorKey`, it has to be added to the `KeyToInterface` as well
// otherwise the following type will complain
export type KeysToResponses<T extends LkErrorKey> = (T extends unknown ?
  LkResponse<KeyToInterface[T]> :
  LkResponse<KeyToInterface[T]>) |
  LkResponse<ConnectionRefused>

export type Success<T> = LkResponse<T> | LkResponse

// Type guard
export function from<E extends LkErrorKey>(keys: E[]): E[] {
  return keys;
}

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

export interface UnknownError extends ILkError<unknown> {
  [key: string]: unknown;
}

export interface ConnectionRefused extends ILkError<LkErrorKey.CONNECTION_REFUSED> {
  fetchConfig: FetchConfig
}

export interface AlreadyExists extends ILkError<LkErrorKey.ALREADY_EXIST> {}
export interface Bug extends ILkError<LkErrorKey.BUG> {}
export interface CannotDeleteNonEmptyFolder extends ILkError<LkErrorKey.CANNOT_DELETE_NON_EMPTY_FOLDER> {}
export interface CannotRead extends ILkError<LkErrorKey.CANNOT_READ> {}
export interface DataSourceUnavailable extends ILkError<LkErrorKey.DATA_SOURCE_UNAVAILABLE> {}
export interface GraphRequestTimeout extends ILkError<LkErrorKey.GRAPH_REQUEST_TIMEOUT> {}
export interface IllegalSourceState extends ILkError<LkErrorKey.ILLEGAL_SOURCE_STATE> {}
export interface InvalidParameter extends ILkError<LkErrorKey.INVALID_PARAMETER> {}
export interface MalformedQueryTemplate extends ILkError<LkErrorKey.MALFORMED_QUERY_TEMPLATE> {
  highlight: {
    offset: number;
    length?: number;
  }
}
export interface NotFound extends ILkError<LkErrorKey.NOT_FOUND> {}
export interface NotOwned extends ILkError<LkErrorKey.NOT_OWNED> {}
export interface NotSupported extends ILkError<LkErrorKey.NOT_SUPPORTED> {}

export interface BadGraphRequest extends ILkError<LkErrorKey.BAD_GRAPH_REQUEST> {}
export interface ConstraintViolation extends ILkError<LkErrorKey.CONSTRAINT_VIOLATION> {}
export interface Forbidden extends ILkError<LkErrorKey.FORBIDDEN> {}
export interface GraphUnreacheable extends ILkError<LkErrorKey.GRAPH_UNREACHABLE> {}
export interface GuestDisabled extends ILkError<LkErrorKey.GUEST_DISABLED> {}
export interface Unauthorized extends ILkError<LkErrorKey.UNAUTHORIZED> {}
export interface WriteForbidden extends ILkError<LkErrorKey.WRITE_FORBIDDEN> {}
