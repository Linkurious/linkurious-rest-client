/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-01.
 */
import {SuperAgentStatic} from 'superagent';

import {IFullUser} from '../api/User/types';
import {IUserDataSource} from '../api/DataSource/types';
import {ErrorListener} from '../errorListener';

import {LkErrorKey, Response} from './response';

/**
 * Interfaces for Request class
 */
export interface RawFetchConfig {
  errors?: LkErrorKey[];
  url: string;
  method: 'GET' | 'DELETE' | 'POST' | 'PUT' | 'PATCH';
  params?: Record<string, any>; // TODO: would be nice not to use any
  query?: Record<string, unknown>;
}
export interface FetchConfig {
  url: string;
  method: 'GET' | 'DELETE' | 'POST' | 'PUT' | 'PATCH';
  body: Record<string, unknown>;
  query: Record<string, unknown>;
}
export interface IClientState {
  user?: IFullUser;
  currentSource?: IUserDataSource;
  guestMode?: boolean;
  sources?: IUserDataSource[];
}
export interface ModuleProps {
  baseUrl: string;
  agent: SuperAgentStatic;
  clientState: IClientState;
  dispatchError: ErrorListener['dispatchError'];
}

/**
 * Basic error to be extended by custom errors
 */
export interface LkError<K = LkErrorKey> {
  key: K;
  message: string;
}

/**
 * In `const name = KeysToResponses<LkErrorKey.FORBIDDEN, LkErrorKey.UNAUTHORIZED>`
 * the type of name is evaluated to `Response<Forbidden> | Response<Unauthorized>`
 */
export type ErrorResponses<T extends LkErrorKey> = T extends unknown
  ? Response<KeyToInterface[T]>
  : Response<KeyToInterface[T]>;

/**
 * Custom errors. These can have custom properties
 */
export interface ConnectionRefused extends LkError<LkErrorKey.CONNECTION_REFUSED> {
  fetchConfig: FetchConfig;
}
export interface AlreadyExists extends LkError<LkErrorKey.ALREADY_EXIST> {}
export interface Bug extends LkError<LkErrorKey.BUG> {}
export interface CannotDeleteNonEmptyFolder
  extends LkError<LkErrorKey.CANNOT_DELETE_NON_EMPTY_FOLDER> {}
export interface CannotRead extends LkError<LkErrorKey.CANNOT_READ> {}
export interface DataSourceUnavailable extends LkError<LkErrorKey.DATA_SOURCE_UNAVAILABLE> {}
export interface GraphRequestTimeout extends LkError<LkErrorKey.GRAPH_REQUEST_TIMEOUT> {}
export interface IllegalSourceState extends LkError<LkErrorKey.ILLEGAL_SOURCE_STATE> {}
export interface InvalidParameter extends LkError<LkErrorKey.INVALID_PARAMETER> {}
export interface MalformedQueryTemplate extends LkError<LkErrorKey.MALFORMED_QUERY_TEMPLATE> {
  highlight: {
    offset: number;
    length?: number;
  };
}
export interface NotFound extends LkError<LkErrorKey.NOT_FOUND> {}
export interface NotOwned extends LkError<LkErrorKey.NOT_OWNED> {}
export interface NotSupported extends LkError<LkErrorKey.NOT_SUPPORTED> {}
export interface BadGraphRequest extends LkError<LkErrorKey.BAD_GRAPH_REQUEST> {}
export interface ConstraintViolation extends LkError<LkErrorKey.CONSTRAINT_VIOLATION> {}
export interface Forbidden extends LkError<LkErrorKey.FORBIDDEN> {}
export interface GraphUnreacheable extends LkError<LkErrorKey.GRAPH_UNREACHABLE> {}
export interface GuestDisabled extends LkError<LkErrorKey.GUEST_DISABLED> {}
export interface Unauthorized extends LkError<LkErrorKey.UNAUTHORIZED> {}
export interface WriteForbidden extends LkError<LkErrorKey.WRITE_FORBIDDEN> {}

// Mapping from LkErrorKey to LkError, it's used by `KeysToResponses`
export type KeyToInterface = {
  [LkErrorKey.CONNECTION_REFUSED]: ConnectionRefused;
  [LkErrorKey.ALREADY_EXIST]: AlreadyExists;
  [LkErrorKey.BUG]: Bug;
  [LkErrorKey.CANNOT_DELETE_NON_EMPTY_FOLDER]: CannotDeleteNonEmptyFolder;
  [LkErrorKey.CANNOT_READ]: CannotRead;
  [LkErrorKey.DATA_SOURCE_UNAVAILABLE]: DataSourceUnavailable;
  [LkErrorKey.GRAPH_REQUEST_TIMEOUT]: GraphRequestTimeout;
  [LkErrorKey.ILLEGAL_SOURCE_STATE]: IllegalSourceState;
  [LkErrorKey.INVALID_PARAMETER]: InvalidParameter;
  [LkErrorKey.MALFORMED_QUERY_TEMPLATE]: MalformedQueryTemplate;
  [LkErrorKey.NOT_FOUND]: NotFound;
  [LkErrorKey.NOT_OWNED]: NotOwned;
  [LkErrorKey.NOT_SUPPORTED]: NotSupported;
  [LkErrorKey.BAD_GRAPH_REQUEST]: BadGraphRequest;
  [LkErrorKey.CONSTRAINT_VIOLATION]: ConstraintViolation;
  [LkErrorKey.FORBIDDEN]: Forbidden;
  [LkErrorKey.GRAPH_UNREACHABLE]: GraphUnreacheable;
  [LkErrorKey.GUEST_DISABLED]: GuestDisabled;
  [LkErrorKey.UNAUTHORIZED]: Unauthorized;
  [LkErrorKey.WRITE_FORBIDDEN]: WriteForbidden;
};
