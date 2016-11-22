/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-04-26.
 *
 * File: HTTPDriver.ts
 * Description : Wrapper for HTTP requests + promises
 */
"use strict";
var request = require('superagent');
var LinkuriousError_1 = require('../LinkuriousError');
var DefaultHttpDriver = (function () {
    function DefaultHttpDriver() {
        this.cookie = '';
    }
    DefaultHttpDriver.prototype.POST = function (uri, data, query) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            request
                .post(uri)
                .withCredentials()
                .send(data)
                .query(query)
                .end(function (err, res) {
                _this.handleResponse(resolve, reject, err, res);
            });
        });
    };
    DefaultHttpDriver.prototype.PUT = function (uri, data, query) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            request
                .put(uri)
                .withCredentials()
                .send(data)
                .query(query)
                .end(function (err, res) {
                _this.handleResponse(resolve, reject, err, res);
            });
        });
    };
    DefaultHttpDriver.prototype.PATCH = function (uri, data, query) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            request
                .patch(uri)
                .withCredentials()
                .send(data)
                .query(query)
                .end(function (err, res) {
                _this.handleResponse(resolve, reject, err, res);
            });
        });
    };
    DefaultHttpDriver.prototype.GET = function (uri, query) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            request
                .get(uri)
                .withCredentials()
                .query(query)
                .end(function (err, res) {
                _this.handleResponse(resolve, reject, err, res);
            });
        });
    };
    DefaultHttpDriver.prototype.DELETE = function (uri, data, query) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            request
                .del(uri)
                .withCredentials()
                .send(data)
                .query(query)
                .end(function (err, res) {
                _this.handleResponse(resolve, reject, err, res);
            });
        });
    };
    DefaultHttpDriver.prototype.handleResponse = function (resolve, reject, err, res) {
        console.log(res);
        console.log(err);
        if ((typeof res.status !== 'number' || res.status < 100) && err) {
            return reject(err);
        }
        if (res.type !== 'application/json') {
            return reject(LinkuriousError_1.LinkuriousError.fromClientError('communication_error', 'Wrong content-type'));
        }
        if (res.header && res.header['set-cookie']) {
            this.cookie = res.header['set-cookie'];
        }
        resolve({
            statusCode: res.status,
            body: res.body,
            header: res.header
        });
    };
    return DefaultHttpDriver;
}());
exports.DefaultHttpDriver = DefaultHttpDriver;
//# sourceMappingURL=DefaultHttpDriver.js.map