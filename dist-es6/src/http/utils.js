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
const CAMEL_CASE_RE = /([a-zA-Z0-9])([A-Z])/g;
class Utils {
    /**
     * take an object with camelCase fields and return one with only snake_case fields.
     *
     * @param data
     * @returns any
     */
    static fixSnakeCase(data) {
        if (!data) {
            return undefined;
        }
        let result = {};
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                let sanitizedKey;
                sanitizedKey = key.replace(CAMEL_CASE_RE, (s, p1, p2) => p1 + '_' + p2.toLowerCase());
                result[sanitizedKey] = data[key];
            }
        }
        return result;
    }
}
exports.Utils = Utils;
//# sourceMappingURL=utils.js.map