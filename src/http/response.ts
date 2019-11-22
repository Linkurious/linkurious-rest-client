/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-01.
 */

import {GenericObject} from '../api/commonTypes';
import {CustomActionParsingError} from '../api/CustomAction';
import {ErrorHighlight} from '../api/GraphQuery';

import {FetchConfig} from './types';

export enum LkErrorKey {
  CONNECTION_REFUSED = 'connection_refused', // Not a server error
  UNAUTHORIZED = 'unauthorized',
  DATA_SOURCE_UNAVAILABLE = 'dataSource_unavailable',
  GUEST_DISABLED = 'guest_disabled',
  // TODO SERVER throw forbidden instead of write_forbidden
  FORBIDDEN = 'forbidden',
  NOT_FOUND = 'not_found',
  BAD_GRAPH_REQUEST = 'bad_graph_request',
  GRAPH_REQUEST_TIMEOUT = 'graph_request_timeout',
  CONSTRAINT_VIOLATION = 'constraint_violation',
  MALFORMED_CUSTOM_ACTION_TEMPLATE = 'malformed_custom_action_template',
  MALFORMED_QUERY_TEMPLATE = 'malformed_query_template',
  ILLEGAL_SOURCE_STATE = 'illegal_source_state',
  CANNOT_DELETE_NON_EMPTY_FOLDER = 'folder_deletion_failed',
  // TODO SERVER throw already exists instead of users and group exists
  ALREADY_EXISTS = 'already_exists',
  // TODO PKAR name too long
  PROPERTY_KEY_ACCESS_RIGHTS_REQUIRES_STRICT_SCHEMA = 'property_key_access_rights_requires_strict_schema',
  PROPERTY_KEY_ACCESS_RIGHTS_REQUIRED = 'property_key_access_rights_required',
  INVALID_PROPERTY_KEY_ACCESS_LEVEL = 'invalid_property_key_access_level',
  EDIT_CONFLICT = 'edit_conflict',
  FEATURE_DISABLED = 'feature_disabled',

  // Supposedly not returned by the rest-client
  INVALID_PARAMETER = 'invalid_parameter',
  BUG = 'bug'
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

  public isError<E extends LkErrorKey>(key: E): this is Response<LkError<E>> {
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
export interface ConnectionRefused extends LkError<LkErrorKey.CONNECTION_REFUSED> {
  fetchConfig: FetchConfig;
}

export interface Unauthorized extends LkError<LkErrorKey.UNAUTHORIZED> {}

export interface DataSourceUnavailable extends LkError<LkErrorKey.DATA_SOURCE_UNAVAILABLE> {}

export interface GuestDisabled extends LkError<LkErrorKey.GUEST_DISABLED> {}

export interface Forbidden extends LkError<LkErrorKey.FORBIDDEN> {}

export interface NotFound extends LkError<LkErrorKey.NOT_FOUND> {
  type: string;
  id: string;
}
export interface BadGraphRequest extends LkError<LkErrorKey.BAD_GRAPH_REQUEST> {
  highlight: ErrorHighlight;
}

export interface GraphRequestTimeout extends LkError<LkErrorKey.GRAPH_REQUEST_TIMEOUT> {}

export interface ConstraintViolation extends LkError<LkErrorKey.CONSTRAINT_VIOLATION> {}

export interface MalformedCustomActionTemplate
  extends LkError<LkErrorKey.MALFORMED_CUSTOM_ACTION_TEMPLATE> {
  errors: CustomActionParsingError[];
}

export interface MalformedQueryTemplate extends LkError<LkErrorKey.MALFORMED_QUERY_TEMPLATE> {
  highlight?: ErrorHighlight;
}

export interface IllegalSourceState extends LkError<LkErrorKey.ILLEGAL_SOURCE_STATE> {}

export interface CannotDeleteNonEmptyFolder
  extends LkError<LkErrorKey.CANNOT_DELETE_NON_EMPTY_FOLDER> {}

export interface AlreadyExists extends LkError<LkErrorKey.ALREADY_EXISTS> {}

export interface PropertyKeyAccessRightsRequiresStrictSchema
  extends LkError<LkErrorKey.PROPERTY_KEY_ACCESS_RIGHTS_REQUIRES_STRICT_SCHEMA> {}

export interface PropertyKeyAccessRightsRequired
  extends LkError<LkErrorKey.PROPERTY_KEY_ACCESS_RIGHTS_REQUIRED> {}

export interface InvalidPropertyKeyAccessLevel
  extends LkError<LkErrorKey.INVALID_PROPERTY_KEY_ACCESS_LEVEL> {}

export interface EditConflict extends LkError<LkErrorKey.EDIT_CONFLICT> {}

export interface FeatureDisabled extends LkError<LkErrorKey.FEATURE_DISABLED> {}

export interface InvalidParameter extends LkError<LkErrorKey.INVALID_PARAMETER> {}

export interface Bug extends LkError<LkErrorKey.BUG> {}

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
  [LkErrorKey.MALFORMED_CUSTOM_ACTION_TEMPLATE]: MalformedCustomActionTemplate;
  [LkErrorKey.MALFORMED_QUERY_TEMPLATE]: MalformedQueryTemplate;
  [LkErrorKey.ILLEGAL_SOURCE_STATE]: IllegalSourceState;
  [LkErrorKey.CANNOT_DELETE_NON_EMPTY_FOLDER]: CannotDeleteNonEmptyFolder;
  [LkErrorKey.ALREADY_EXISTS]: AlreadyExists;
  [LkErrorKey.PROPERTY_KEY_ACCESS_RIGHTS_REQUIRES_STRICT_SCHEMA]: PropertyKeyAccessRightsRequiresStrictSchema;
  [LkErrorKey.PROPERTY_KEY_ACCESS_RIGHTS_REQUIRED]: PropertyKeyAccessRightsRequired;
  [LkErrorKey.INVALID_PROPERTY_KEY_ACCESS_LEVEL]: InvalidPropertyKeyAccessLevel;
  [LkErrorKey.EDIT_CONFLICT]: EditConflict;
  [LkErrorKey.FEATURE_DISABLED]: FeatureDisabled;
  [LkErrorKey.INVALID_PARAMETER]: InvalidParameter;
  [LkErrorKey.BUG]: Bug;
};
