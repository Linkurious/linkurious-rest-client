/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-11-22.
 *
 * File:
 * Description :
 */
'use strict';
var fetcher_1 = require('./fetcher');
var FetcherFactory = (function () {
    function FetcherFactory() {
    }
    FetcherFactory.prototype.create = function (_logger, _clientState, host) {
        return new fetcher_1.Fetcher(_logger, _clientState, host);
    };
    return FetcherFactory;
}());
exports.FetcherFactory = FetcherFactory;
//# sourceMappingURL=FetcherFactory.js.map