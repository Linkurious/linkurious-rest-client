/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-05-16.
 */

export class Mock {
  public static wrap(type: string, value?: unknown, status?: string) {
    return {
      type: type,
      status: status,
      value: value
    };
  }

  public static date(value: unknown) {
    if (typeof value === 'number') {
      return Mock.wrap('date', value);
    }

    return Mock.wrap('auto', value, 'conflict');
  }

  public static datetime(value: unknown) {
    if (typeof value === 'number') {
      return Mock.wrap('datetime', value);
    }

    return Mock.wrap('auto', value, 'conflict');
  }

  public static missing(type: string) {
    return Mock.wrap(type, undefined, 'missing');
  }

  public static properties<T extends {data?: T}>(item: T): T {
    if (typeof item.data === 'object') {
      const data = item.data || {};
      for (const key of Object.keys(data)) {
        switch (key) {
          case 'date':
            // @ts-ignore
            data[key] = Mock.date(data[key]);
            break;
          case 'datetime':
            // @ts-ignore
            data[key] = Mock.datetime(data[key]);
            break;
          case 'missing':
            // @ts-ignore
            data[key] = Mock.missing(data[key]);
            break;
        }
      }
    }
    return item;
  }
}
