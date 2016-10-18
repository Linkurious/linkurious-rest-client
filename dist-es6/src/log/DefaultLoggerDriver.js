/* tslint:disable:no-console */
/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by david on 2016-05-27.
 *
 * File:
 * Description :
 */
'use strict';
var DefaultLoggerDriver = (function () {
    function DefaultLoggerDriver() {
    }
    DefaultLoggerDriver.prototype.debug = function (message) {
        console.debug(message);
    };
    DefaultLoggerDriver.prototype.error = function (message) {
        console.error(message);
    };
    return DefaultLoggerDriver;
}());
exports.DefaultLoggerDriver = DefaultLoggerDriver;
//# sourceMappingURL=DefaultLoggerDriver.js.map