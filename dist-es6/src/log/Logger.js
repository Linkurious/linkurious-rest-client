/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-04-27.
 *
 * File:
 * Description :
 */
'use strict';
const DefaultLoggerDriver_1 = require('./DefaultLoggerDriver');
const LOG_LEVELS = new Map();
LOG_LEVELS.set('debug', 0);
LOG_LEVELS.set('error', 1);
LOG_LEVELS.set('quiet', 99);
class Logger {
    constructor(level, driver) {
        this.level = level;
        this.numericalLevel = LOG_LEVELS.get(level);
        this.driver = driver ? driver : new DefaultLoggerDriver_1.DefaultLoggerDriver();
    }
    debug(error) {
        this.log('debug', error);
    }
    error(error) {
        this.log('error', error);
    }
    log(level, error) {
        if (LOG_LEVELS.get(level) >= this.numericalLevel) {
            this.driver[level](`[${error.type}] ${error.key}: ${error.message}`);
        }
    }
}
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map