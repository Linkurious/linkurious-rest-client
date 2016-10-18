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
const request = require('superagent');
class DefaultHttpDriver {
    constructor() {
        this.cookie = '';
    }
    POST(uri, data, query) {
        return new Promise((resolve, reject) => {
            request
                .post(uri)
                .withCredentials()
                .send(data)
                .query(query)
                .end((err, res) => {
                this.handleResponse(resolve, reject, err, res);
            });
        });
    }
    PUT(uri, data, query) {
        return new Promise((resolve, reject) => {
            request
                .put(uri)
                .withCredentials()
                .send(data)
                .query(query)
                .end((err, res) => {
                this.handleResponse(resolve, reject, err, res);
            });
        });
    }
    PATCH(uri, data, query) {
        return new Promise((resolve, reject) => {
            request
                .patch(uri)
                .withCredentials()
                .send(data)
                .query(query)
                .end((err, res) => {
                this.handleResponse(resolve, reject, err, res);
            });
        });
    }
    GET(uri, query) {
        return new Promise((resolve, reject) => {
            request
                .get(uri)
                .withCredentials()
                .query(query)
                .end((err, res) => {
                this.handleResponse(resolve, reject, err, res);
            });
        });
    }
    DELETE(uri, data, query) {
        return new Promise((resolve, reject) => {
            request
                .del(uri)
                .withCredentials()
                .send(data)
                .query(query)
                .end((err, res) => {
                this.handleResponse(resolve, reject, err, res);
            });
        });
    }
    handleResponse(resolve, reject, err, res) {
        if ((typeof res.status !== 'number' || res.status < 100) && err) {
            return reject(err);
        }
        if (res.header && res.header['set-cookie']) {
            this.cookie = res.header['set-cookie'];
        }
        resolve({
            statusCode: res.status,
            body: res.body,
            header: res.header
        });
    }
}
exports.DefaultHttpDriver = DefaultHttpDriver;
//# sourceMappingURL=DefaultHttpDriver.js.map