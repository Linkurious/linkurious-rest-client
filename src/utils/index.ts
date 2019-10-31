/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

export class Utils {
  /**
   * take an object with camelCase fields and return one with only snake_case fields.
   *
   * @param data
   * @returns any
   */
  public static fixSnakeCase(data: any): any {
    if (!data) {
      return undefined;
    }

    const result: any = {};

    const CamelCaseRx = /([a-zA-Z0-9])([A-Z])/g;

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        let sanitizedKey: string;

        sanitizedKey = key.replace(
          CamelCaseRx,
          (s: string, p1: string, p2: string) => p1 + '_' + p2.toLowerCase()
        );

        result[sanitizedKey] = data[key];
      }
    }
    return result;
  }

  public static clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
  }

  public static isDefined(value: unknown): value is {} {
    return value !== null && value !== undefined;
  }
}
