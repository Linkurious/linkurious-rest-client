/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-01.
 */

import {GenericObject} from '../api/commonTypes';
import {CustomActionParsingError} from '../api/CustomAction';
import {ErrorHighlight} from '../api/GraphQuery';
import {hasValue} from '../utils';
import {SearchSyntaxError} from '../api/Search';

import {FetchConfig} from './types';

export enum LkErrorKey {
  // Not a server error, thrown internally by the rest-client
  CONNECTION_REFUSED = 'connection_refused',

  // Business and access errors
  FEATURE_DISABLED = 'feature_disabled',
  UNAUTHORIZED = 'unauthorized',
  DATA_SOURCE_UNAVAILABLE = 'dataSource_unavailable',
  GUEST_DISABLED = 'guest_disabled',
  FORBIDDEN = 'forbidden',
  NOT_FOUND = 'not_found',
  BAD_GRAPH_REQUEST = 'bad_graph_request',
  GRAPH_REQUEST_TIMEOUT = 'graph_request_timeout',
  CONSTRAINT_VIOLATION = 'constraint_violation',
  MALFORMED_CUSTOM_ACTION_TEMPLATE = 'malformed_custom_action_template',
  MALFORMED_QUERY_TEMPLATE = 'malformed_query_template',
  MALFORMED_SEARCH_SYNTAX = 'malformed_search_syntax',
  ILLEGAL_SOURCE_STATE = 'illegal_source_state',
  FOLDER_DELETION_FAILED = 'folder_deletion_failed',
  ALREADY_EXISTS = 'already_exists',
  STRICT_SCHEMA_REQUIRED = 'strict_schema_required',
  PROPERTY_KEY_ACCESS_RIGHTS_REQUIRED = 'property_key_access_rights_required',
  INVALID_PROPERTY_KEY_ACCESS_LEVEL = 'invalid_property_key_access_level',
  EDIT_CONFLICT = 'edit_conflict',
  VISUALIZATION_LOCKED = 'visualization_locked',
  NOT_SUPPORTED = 'not_supported',
  SOURCE_ACTION_NEEDED = 'source_action_needed',

  // Supposedly not returned by the rest-client
  INVALID_PARAMETER = 'invalid_parameter',
  CRITICAL = 'critical',
  BUG = 'bug',
  SOCKET_ERROR = 'socket_error',
  API_NOT_FOUND = 'api_not_found',
  PLUGIN_NOT_READY = 'plugin_not_ready',
  PLUGIN_SERVICE_NOT_READY = 'plugin_service_not_ready'
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
    return this.status >= 200 && this.status < 300;
  }

  public isError<R extends Response<unknown>, E extends LkErrorKey>(
    this: R,
    // I found out that extending in the params like this surprisingly works as a highlighter
    key: E extends PossibleErrorKeys<R> ? E : PossibleErrorKeys<R>
  ): this is E extends PossibleErrorKeys<R> ? Response<LkErrorKeyToInterface[E]> : never {
    return hasValue(this.body) && (this.body as LkError).key === key;
  }
}

/**
 * Input:
 *    ErrorResponses<LkErrorKey.FORBIDDEN, LkErrorKey.UNAUTHORIZED>
 * Output:
 *    Response<ForbiddenError> | Response<UnauthorizedError>
 */
export type ErrorResponses<T extends LkErrorKey> = T extends unknown
  ? Response<LkErrorKeyToInterface[T]>
  : Response<LkErrorKeyToInterface[T]>;

/**
 * Input:
 *    Response<AlreadyExistsError> | Response<CustomAction[]> | Response<EditConflictError>
 * Output:
 *    LkErrorKey.ALREADY_EXISTS_ERROR | LkErrorKey.EDIT_CONFLICT_ERROR
 */
export type PossibleErrorKeys<R> = R extends {
  body: {key: infer ErrorKeys};
}
  ? ErrorKeys
  : never;

/**
 * Every error can carry some payload
 */
export interface ConnectionRefusedError extends LkError<LkErrorKey.CONNECTION_REFUSED> {
  fetchConfig: FetchConfig;
}

export interface FeatureDisabledError extends LkError<LkErrorKey.FEATURE_DISABLED> {}

export enum UnauthorizedErrorReason {
  SESSION_EXPIRED = 'session_expired',
  SESSION_EVICTED = 'session_evicted',
  SERVER_FULL = 'server_full'
}

export interface UnauthorizedError extends LkError<LkErrorKey.UNAUTHORIZED> {
  reason?: UnauthorizedErrorReason;
}

export interface DataSourceUnavailableError extends LkError<LkErrorKey.DATA_SOURCE_UNAVAILABLE> {}

export interface GuestDisabledError extends LkError<LkErrorKey.GUEST_DISABLED> {}

export interface ForbiddenError extends LkError<LkErrorKey.FORBIDDEN> {}

export interface NotFoundError extends LkError<LkErrorKey.NOT_FOUND> {}

export interface BadGraphRequestError extends LkError<LkErrorKey.BAD_GRAPH_REQUEST> {
  highlight?: ErrorHighlight;
}

export interface GraphRequestTimeoutError extends LkError<LkErrorKey.GRAPH_REQUEST_TIMEOUT> {}

export interface ConstraintViolationError extends LkError<LkErrorKey.CONSTRAINT_VIOLATION> {}

export interface MalformedCustomActionTemplateError
  extends LkError<LkErrorKey.MALFORMED_CUSTOM_ACTION_TEMPLATE> {
  errors: CustomActionParsingError[];
}

export interface MalformedSearchSyntaxError extends LkError<LkErrorKey.MALFORMED_SEARCH_SYNTAX> {
  details: SearchSyntaxError;
}

export interface MalformedQueryTemplateError extends LkError<LkErrorKey.MALFORMED_QUERY_TEMPLATE> {
  highlight?: ErrorHighlight;
}

export interface IllegalSourceStateError extends LkError<LkErrorKey.ILLEGAL_SOURCE_STATE> {}

export interface FolderDeletionFailedError extends LkError<LkErrorKey.FOLDER_DELETION_FAILED> {}

export interface AlreadyExistsError extends LkError<LkErrorKey.ALREADY_EXISTS> {}

export interface StrictSchemaRequiredError extends LkError<LkErrorKey.STRICT_SCHEMA_REQUIRED> {}

export interface PropertyKeyAccessRightsRequiredError
  extends LkError<LkErrorKey.PROPERTY_KEY_ACCESS_RIGHTS_REQUIRED> {}

export interface InvalidPropertyKeyAccessLevelError
  extends LkError<LkErrorKey.INVALID_PROPERTY_KEY_ACCESS_LEVEL> {}

export interface EditConflictError extends LkError<LkErrorKey.EDIT_CONFLICT> {}

export interface VisualizationLockedError extends LkError<LkErrorKey.VISUALIZATION_LOCKED> {}

export interface NotSupportedError extends LkError<LkErrorKey.NOT_SUPPORTED> {}

export interface SourceActionNeededError extends LkError<LkErrorKey.SOURCE_ACTION_NEEDED> {}

export interface InvalidParameterError extends LkError<LkErrorKey.INVALID_PARAMETER> {}

export interface CriticalError extends LkError<LkErrorKey.CRITICAL> {}

export interface Bug extends LkError<LkErrorKey.BUG> {}

export interface SocketError extends LkError<LkErrorKey.SOCKET_ERROR> {}

export interface ApiNotFoundError extends LkError<LkErrorKey.API_NOT_FOUND> {}

export interface PluginNotReadyError extends LkError<LkErrorKey.PLUGIN_NOT_READY> {}

export interface PluginServiceNotReadyError extends LkError<LkErrorKey.PLUGIN_SERVICE_NOT_READY> {}

// Mapping from LkErrorKey to LkError, it's used by `ErrorResponses`
export type LkErrorKeyToInterface = {
  [LkErrorKey.CONNECTION_REFUSED]: ConnectionRefusedError;
  [LkErrorKey.FEATURE_DISABLED]: FeatureDisabledError;
  [LkErrorKey.UNAUTHORIZED]: UnauthorizedError;
  [LkErrorKey.DATA_SOURCE_UNAVAILABLE]: DataSourceUnavailableError;
  [LkErrorKey.GUEST_DISABLED]: GuestDisabledError;
  [LkErrorKey.FORBIDDEN]: ForbiddenError;
  [LkErrorKey.NOT_FOUND]: NotFoundError;
  [LkErrorKey.BAD_GRAPH_REQUEST]: BadGraphRequestError;
  [LkErrorKey.GRAPH_REQUEST_TIMEOUT]: GraphRequestTimeoutError;
  [LkErrorKey.CONSTRAINT_VIOLATION]: ConstraintViolationError;
  [LkErrorKey.MALFORMED_CUSTOM_ACTION_TEMPLATE]: MalformedCustomActionTemplateError;
  [LkErrorKey.MALFORMED_QUERY_TEMPLATE]: MalformedQueryTemplateError;
  [LkErrorKey.MALFORMED_SEARCH_SYNTAX]: MalformedSearchSyntaxError;
  [LkErrorKey.ILLEGAL_SOURCE_STATE]: IllegalSourceStateError;
  [LkErrorKey.FOLDER_DELETION_FAILED]: FolderDeletionFailedError;
  [LkErrorKey.ALREADY_EXISTS]: AlreadyExistsError;
  [LkErrorKey.STRICT_SCHEMA_REQUIRED]: StrictSchemaRequiredError;
  [LkErrorKey.PROPERTY_KEY_ACCESS_RIGHTS_REQUIRED]: PropertyKeyAccessRightsRequiredError;
  [LkErrorKey.INVALID_PROPERTY_KEY_ACCESS_LEVEL]: InvalidPropertyKeyAccessLevelError;
  [LkErrorKey.EDIT_CONFLICT]: EditConflictError;
  [LkErrorKey.VISUALIZATION_LOCKED]: VisualizationLockedError;
  [LkErrorKey.NOT_SUPPORTED]: NotSupportedError;
  [LkErrorKey.SOURCE_ACTION_NEEDED]: SourceActionNeededError;
  [LkErrorKey.INVALID_PARAMETER]: InvalidParameterError;
  [LkErrorKey.CRITICAL]: CriticalError;
  [LkErrorKey.BUG]: Bug;
  [LkErrorKey.SOCKET_ERROR]: SocketError;
  [LkErrorKey.API_NOT_FOUND]: ApiNotFoundError;
  [LkErrorKey.PLUGIN_NOT_READY]: PluginNotReadyError;
  [LkErrorKey.PLUGIN_SERVICE_NOT_READY]: PluginServiceNotReadyError;
};
