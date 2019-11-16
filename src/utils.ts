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
  for (let i = 0; i !== length; i++) {
    if (predicate.call(array, array[i])) {
      return array[i];
    }
  }
  return undefined;
}

export function endsWith(str: string, search: string) {
  return str.substring(str.length - search.length, str.length) === search;
}
