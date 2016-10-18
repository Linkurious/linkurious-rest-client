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
class LinkuriousError {
    constructor(status, type, key, message, cause) {
        this.status = status;
        this.type = type;
        this.key = key;
        this.message = message;
        this.cause = cause;
    }
    static fromHttpResponse(r) {
        let status = r.statusCode;
        let type = LinkuriousError.getErrorType(r.statusCode);
        let key;
        let message;
        if (type === 'communication') {
            key = 'communication_error';
            message = 'Could not get response from server';
        }
        else {
            key = r.body.key;
            message = r.body.message;
        }
        return new LinkuriousError(status, type, key, message);
    }
    static fromError(error) {
        return new LinkuriousError(0, 'communication', 'unknown_error', error.message ? `${error.name}: ${error.message}` : JSON.stringify(error), error);
    }
    get stack() {
        return this.cause ? this.cause.stack : undefined;
    }
    get stackArray() {
        return this.stack === undefined ? [] : this.stack.split(/\n/g);
    }
    static fromClientError(key, message) {
        return new LinkuriousError(0, 'client', key, message);
    }
    static isError(r) {
        return r.statusCode === undefined || r.statusCode < 100 || r.statusCode >= 400;
    }
    static getErrorType(status) {
        if (status === undefined) {
            return 'communication';
        }
        else if (status < 100) {
            return 'communication';
        }
        else if (status === 401 || status === 403) {
            return 'access';
        }
        else if (status >= 500) {
            return 'technical';
        }
        else {
            return 'business';
        }
    }
}
exports.LinkuriousError = LinkuriousError;
//# sourceMappingURL=LinkuriousError.js.map