/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-05-30.
 *
 * File:
 * Description :
 */
'use strict';
/**
 * @abstract
 */
var Module = (function () {
    function Module(fetcher) {
        this._fetcher = fetcher;
    }
    Module.prototype.fetch = function (config) {
        return this._fetcher.fetch(config);
    };
    Module.prototype.setDataSourceKey = function (dataSourceKey) {
        return dataSourceKey ? { dataSourceKey: dataSourceKey } : undefined;
    };
    return Module;
}());
exports.Module = Module;
//# sourceMappingURL=Module.js.map