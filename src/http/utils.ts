/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-04-28.
 *
 * File:
 * Description :
 */
'use strict';

const CAMEL_CASE_RE:RegExp = /([a-zA-Z0-9])([A-Z])/g;

export class Utils {

  /**
   * take an object with camelCase fields and return one with only snake_case fields.
   *
   * @param data
   * @returns any
   */
  public static fixSnakeCase(data:any):any {
    if (!data) {
      return undefined;
    }

    let result:any = {};

    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        let sanitizedKey:string;

        sanitizedKey = key.replace(
          CAMEL_CASE_RE,
          (s:string, p1:string, p2:string) => p1 + '_' + p2.toLowerCase()
        );

        result[sanitizedKey] = data[key];
      }
    }
    return result;
  }
}
