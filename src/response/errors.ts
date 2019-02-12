/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maxime on 08/01/2019.
 *
 * File: unauthorized
 * Description :
 */

'use strict';

import { ServerResponse } from './index';
import { Tools } from 'linkurious-shared';

export type ServerRejectioKey =
  | 'bad_graph_request'
  | 'constraint_violation'
  | 'dataSource_unavailable'
  | 'forbidden'
  | 'graph_request_timeout'
  | 'graph_unreachable'
  | 'group_exists'
  | 'guest_disabled'
  | 'invalid_parameter'
  | 'not_found'
  | 'unauthorized'
  | 'write_forbidden';

export type FrontRejectionKey = 'promise_cancelled' | 'client_error' | 'action_forbidden';

export class ClientRejection extends ServerResponse<FrontRejectionKey> {
  public readonly message: string;
  public readonly cause: string;
  public readonly stack: string;

  constructor(e: { key: FrontRejectionKey; message: string; cause?: Error }) {
    super(e.key);
    this.message = e.message;
    this.cause = e.cause ? e.cause.message : undefined;
    this.stack = e.cause ? e.cause.stack : undefined;
  }

  public isPromiseCancelled(): this is PromiseCancelled {
    return this.key === 'promise_cancelled';
  }
  public isForbidden(): this is ActionForbidden {
    return this.key === 'action_forbidden';
  }
  public isClientError(): this is ClientError {
    return this.key === 'client_error';
  }
}

export class ServerRejection extends ServerResponse<ServerRejectioKey> {
  public readonly message: string;
  public readonly status: number;
  private readonly _data: any;

  constructor(e: { key: ServerRejectioKey; message: string; status: number; data?: any }) {
    super(e.key);
    this.message = e.message;
    this.status = e.status;
    this._data = e.data || {};
  }

  /**
   * Return true if an offset exists in rejection
   */
  public get hasOffset(): boolean {
    return Tools.isDefined(this._data.offset);
  }

  /**
   * Return the offset error
   */
  public get offset(): { offset: number; length?: number } {
    return this.hasOffset ? this._data : undefined;
  }

  public isBadGraphRequest(): this is BadGraphRequest {
    return this.key === 'bad_graph_request';
  }
  public isConstraintViolation(): this is ConstraintViolation {
    return this.key === 'constraint_violation';
  }
  public isDatasourceUnavailable(): this is DataSourceUnavailable {
    return this.key === 'dataSource_unavailable';
  }
  public isForbidden(): this is Forbidden {
    return this.key === 'forbidden';
  }
  public isGraphRequestTimeout(): this is GraphRequestTimeout {
    return this.key === 'graph_request_timeout';
  }
  public isGraphUnreachable(): this is GraphUnreachable {
    return this.key === 'graph_unreachable';
  }
  public isGroupExists(): this is GroupExists {
    return this.key === 'group_exists';
  }
  public isGuestDisabled(): this is GuestDisabled {
    return this.key === 'guest_disabled';
  }
  public isInvalidParameter(): this is InvalidParameter {
    return this.key === 'invalid_parameter';
  }
  public isNotFound(): this is NotFound {
    return this.key === 'not_found';
  }
  public isUnauthorized(): this is Unauthorized {
    return this.key === 'unauthorized';
  }
  public isWriteForbidden(): this is WriteForbidden {
    return this.key === 'write_forbidden';
  }
}

export class BadGraphRequest extends ServerRejection {
  key: 'bad_graph_request';
}
export class ConstraintViolation extends ServerRejection {
  key: 'constraint_violation';
}
export class DataSourceUnavailable extends ServerRejection {
  key: 'dataSource_unavailable';
}
export class Forbidden extends ServerRejection {
  key: 'forbidden';
}
export class GraphRequestTimeout extends ServerRejection {
  key: 'graph_request_timeout';
}
export class GraphUnreachable extends ServerRejection {
  key: 'graph_unreachable';
}
export class GroupExists extends ServerRejection {
  key: 'group_exists';
}
export class GuestDisabled extends ServerRejection {
  key: 'guest_disabled';
}
export class InvalidParameter extends ServerRejection {
  key: 'invalid_parameter';
}
export class NotFound extends ServerRejection {
  key: 'not_found';
}
export class Unauthorized extends ServerRejection {
  key: 'unauthorized';
}
export class WriteForbidden extends ServerRejection {
  key: 'write_forbidden';
}
export class PromiseCancelled extends ClientRejection {
  key: 'promise_cancelled';
}
export class ClientError extends ClientRejection {
  key: 'client_error';
}
export class ActionForbidden extends ClientRejection {
  key: 'action_forbidden';
}

const test = new ServerRejection({ key: 'bad_graph_request', message: '', status: 400 });

let i;
if (test.isBadGraphRequest()) {
  i = test.message;
} else if (test.isUnauthorized()) {
  i = test.message;
} else {
  i = test.message;
}
