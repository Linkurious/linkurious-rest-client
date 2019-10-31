/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-03-13.
 */

import {LkErrorKey, LkErrorKeyToInterface} from './http/response';

type SimpleCallback<A = unknown, B = unknown> = (payload: A) => B;
type SimpleListeners = Record<LkErrorKey, SimpleCallback>;

export class ErrorListener {
  private readonly listeners: SimpleListeners = {} as SimpleListeners;

  protected dispatchError<T extends LkErrorKey>(key: T, payload: LkErrorKeyToInterface[T]): void {
    if (
      Object.prototype.hasOwnProperty.call(this.listeners, key) &&
      typeof this.listeners[key] === 'function'
    ) {
      this.listeners[key](payload);
    }
  }

  public setErrorListener(key: LkErrorKey, callback: SimpleCallback): void {
    this.listeners[key] = callback;
  }

  public removeErrorListener(key: LkErrorKey): void {
    delete this.listeners[key];
  }

  public getErrorKeysListened(): LkErrorKey[] {
    return Object.keys(this.listeners) as LkErrorKey[];
  }
}
