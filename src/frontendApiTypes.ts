/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2026
 *
 * - Created on 2026-04-15.
 */

export interface BaseFrontendApiCall {
  kind: 'LinkuriousFrontendApiCall';
  method: string;
  methodVersion: number;
  methodParams?: {};
}

export interface FrontendApiRefreshQueries extends BaseFrontendApiCall {
  method: 'SavedGraphQueries.refresh';
  methodVersion: 1;
}

export interface FrontendApiCloseModal extends BaseFrontendApiCall {
  method: 'CustomActionModal.close';
  methodVersion: 1;
}

export type FrontendApiCall = FrontendApiRefreshQueries | FrontendApiCloseModal;

export function isFrontendApiCall(o: unknown): o is FrontendApiCall {
  return (
    o !== null &&
    o !== undefined &&
    typeof o === 'object' &&
    'kind' in o &&
    (o as BaseFrontendApiCall).kind === 'LinkuriousFrontendApiCall'
  );
}

export function checkMethodVersion<T extends FrontendApiCall>(
  call: T,
  expectedVersion: T['methodVersion']
): void {
  if (call.methodVersion !== expectedVersion) {
    throw new Error(
      `FrontendApi: Unexpected version ${call.methodVersion as number} for method ${call.method as string} (expected ${expectedVersion as number})`
    );
  }
}
