/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-01.
 */
import {LkError} from './types';

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
  WRITE_FORBIDDEN = 'write_forbidden' // in Access
}

export class Response<B = unknown> {
  body: B;
  status: number;
  header: Record<string, unknown>;
  constructor(props: {body: B; status?: number; header?: Record<string, unknown>}) {
    this.body = props.body;
    this.status = props.status || 0;
    this.header = props.header || {};
  }
  public isSuccess(): this is Exclude<this, Response<LkError>> {
    return (
      this.status >= 200 &&
      this.status < 300 &&
      !(((this.body as unknown) as LkError).key in LkErrorKey)
    );
  }
  public isAnyError(): this is Extract<this, Response<LkError>> {
    return ((this.body as unknown) as LkError).key in LkErrorKey;
  }
  // TODO: write this method as non static
  public static isError<R extends Response, E extends LkErrorKey>(
    response: R,
    key: E
  ): response is Extract<R, Response<LkError<E>>> {
    return (response.body as LkError).key === key;
  }
}
