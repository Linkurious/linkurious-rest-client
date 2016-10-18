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
var LinkuriousError = (function () {
    function LinkuriousError(status, type, key, message, cause) {
        this.status = status;
        this.type = type;
        this.key = key;
        this.message = message;
        this.cause = cause;
    }
    LinkuriousError.fromHttpResponse = function (r) {
        var status = r.statusCode;
        var type = LinkuriousError.getErrorType(r.statusCode);
        var key;
        var message;
        if (type === 'communication') {
            key = 'communication_error';
            message = 'Could not get response from server';
        }
        else {
            key = r.body.key;
            message = r.body.message;
        }
        return new LinkuriousError(status, type, key, message);
    };
    LinkuriousError.fromError = function (error) {
        return new LinkuriousError(0, 'communication', 'unknown_error', error.message ? error.name + ": " + error.message : JSON.stringify(error), error);
    };
    Object.defineProperty(LinkuriousError.prototype, "stack", {
        get: function () {
            return this.cause ? this.cause.stack : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LinkuriousError.prototype, "stackArray", {
        get: function () {
            return this.stack === undefined ? [] : this.stack.split(/\n/g);
        },
        enumerable: true,
        configurable: true
    });
    LinkuriousError.fromClientError = function (key, message) {
        return new LinkuriousError(0, 'client', key, message);
    };
    LinkuriousError.isError = function (r) {
        return r.statusCode === undefined || r.statusCode < 100 || r.statusCode >= 400;
    };
    LinkuriousError.getErrorType = function (status) {
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
    };
    return LinkuriousError;
}());
exports.LinkuriousError = LinkuriousError;
//# sourceMappingURL=LinkuriousError.js.map