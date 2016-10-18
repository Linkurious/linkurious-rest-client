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
class Module {
    constructor(fetcher) {
        this._fetcher = fetcher;
    }
    fetch(config) {
        return this._fetcher.fetch(config);
    }
    setDataSourceKey(dataSourceKey) {
        return dataSourceKey ? { dataSourceKey: dataSourceKey } : undefined;
    }
}
exports.Module = Module;
//# sourceMappingURL=Module.js.map