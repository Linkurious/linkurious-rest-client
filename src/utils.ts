/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-11-16.
 */

export function includes<T>(array: Array<T>, element: T): boolean {
  return array.indexOf(element) !== -1;
}

export function find<T>(array: T[], predicate: (e: T) => boolean): T | undefined {
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      return array[i];
    }
  }
  return undefined;
}

export function endsWith(str: string, search: string) {
  return str.substring(str.length - search.length, str.length) === search;
}

export function hasValue<T>(o: T): o is NonNullable<T> {
  return o !== undefined && o !== null;
}
