/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-03-13.
 */
import {LkErrorKey} from "./response";
import {GenericFunction} from "./commonTypes";

type SimpleListeners = {
  [key in LkErrorKey]: GenericFunction;
}

export class ErrorListener {
  private readonly listeners: SimpleListeners = {} as SimpleListeners;

  dispatchError(key: LkErrorKey, payload: unknown): void {
    if (this.listeners.hasOwnProperty(key) && typeof this.listeners[key] === 'function') {
      this.listeners[key](payload);
    }
  }

  // You cannot set more than one error listener key
  setErrorListener(key: LkErrorKey, callback: GenericFunction): void {
    this.listeners[key] = callback;
  }

  removeErrorListener(key: LkErrorKey) {
    delete this.listeners[key];
  }

  // Utility
  getErrorKeysListened(): string[] {
    return Object.keys(this.listeners);
  }

  setBasicListenerToAllErrors(): void {
    for(const errorKey in LkErrorKey) {
      this.setErrorListener(errorKey as LkErrorKey, (payload: unknown) => console.log(payload))
    }
  }
}
