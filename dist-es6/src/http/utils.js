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
var CAMEL_CASE_RE = /([a-zA-Z0-9])([A-Z])/g;
var Utils = (function () {
    function Utils() {
    }
    /**
     * take an object with camelCase fields and return one with only snake_case fields.
     *
     * @param data
     * @returns any
     */
    Utils.fixSnakeCase = function (data) {
        if (!data) {
            return undefined;
        }
        var result = {};
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var sanitizedKey = void 0;
                sanitizedKey = key.replace(CAMEL_CASE_RE, function (s, p1, p2) { return p1 + '_' + p2.toLowerCase(); });
                result[sanitizedKey] = data[key];
            }
        }
        return result;
    };
    return Utils;
}());
exports.Utils = Utils;
//# sourceMappingURL=utils.js.map