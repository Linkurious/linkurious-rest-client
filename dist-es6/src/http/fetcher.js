/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-05-27.
 *
 * File:
 * Description :
 */
'use strict';
var LinkuriousError_1 = require('./../LinkuriousError');
var DefaultHttpDriver_1 = require('./DefaultHttpDriver');
var utils_1 = require('./utils');
var Fetcher = (function () {
    function Fetcher(logger, clientState, host, httpDriver) {
        this._httpDriver = httpDriver ? httpDriver : new DefaultHttpDriver_1.DefaultHttpDriver();
        this._logger = logger;
        this._clientState = clientState;
        this._host = host;
        this._baseUrl = this._host + '/api';
    }
    /**
     * HTTPDriver wrapper method
     *
     * @param {IFetchConfig} configData
     * @returns {Promise.<*>} the response body
     */
    Fetcher.prototype.fetch = function (configData) {
        var _this = this;
        var config = JSON.parse(JSON.stringify(configData));
        var data = {
            queryData: config.query,
            bodyData: config.body
        };
        try {
            config.url = this.transformUrl(config, data);
        }
        catch (lkError) {
            return Promise.reject(lkError);
        }
        var responsePromise;
        if (config.method === 'GET') {
            responsePromise = this._httpDriver[config.method](config.url, utils_1.Utils.fixSnakeCase(data.queryData));
        }
        else {
            responsePromise = this._httpDriver[config.method](config.url, data.bodyData, utils_1.Utils.fixSnakeCase(data.queryData));
        }
        return responsePromise.catch(function (error) {
            // console.log(JSON.stringify(error.stack.split(/\s*\n\s*/), null, ' '));
            // create a linkurious error from "hard" errors
            return Promise.reject(LinkuriousError_1.LinkuriousError.fromError(error));
        }).then(function (response) {
            // create a linkurious error from "soft" error
            if (LinkuriousError_1.LinkuriousError.isError(response)) {
                var linkuriousError = LinkuriousError_1.LinkuriousError.fromHttpResponse(response);
                return Promise.reject(linkuriousError);
            }
            // resolve with response body in case of success
            return response.body;
        }).catch(function (error) {
            // logging interceptor
            _this._logger.error(error);
            return Promise.reject(error);
        });
    };
    Fetcher.prototype.addSourceKeyToUrl = function (url, explicitSource) {
        if (explicitSource) {
            return this._baseUrl + url.replace(Fetcher.SOURCE_KEY_TEMPLATE, explicitSource.dataSourceKey);
        }
        else if (this._clientState.currentSource) {
            return this._baseUrl + url.replace(Fetcher.SOURCE_KEY_TEMPLATE, this._clientState.currentSource.key);
        }
        else {
            throw LinkuriousError_1.LinkuriousError.fromClientError('state_error', "You need to set a current source to fetch this API (" + url + ").");
        }
    };
    Fetcher.prototype.addSourceIndexToUrl = function (url, explicitSource) {
        if (explicitSource) {
            return this._baseUrl + url.replace(Fetcher.SOURCE_INDEX_TEMPLATE, explicitSource.dataSourceIndex + '');
        }
        else if (this._clientState.currentSource) {
            return this._baseUrl + url.replace(Fetcher.SOURCE_INDEX_TEMPLATE, this._clientState.currentSource.key);
        }
        else {
            throw LinkuriousError_1.LinkuriousError.fromClientError('state_error', "You need to set a current source to fetch this API (" + url + ").");
        }
    };
    Fetcher.prototype.handleIdInUrl = function (url, body, query) {
        if (body) {
            var id = body.id;
            delete body.id;
            return url.replace(Fetcher.OBJECT_ID_TEMPLATE, id + '');
        }
        if (query) {
            var id = query.id;
            delete query.id;
            return url.replace(Fetcher.OBJECT_ID_TEMPLATE, id + '');
        }
        throw LinkuriousError_1.LinkuriousError.fromClientError('state_error', "You need an ID to fetch this API (" + url + ").");
    };
    Fetcher.prototype.transformUrl = function (config, data) {
        if (config.url.indexOf(Fetcher.OBJECT_ID_TEMPLATE) >= 0) {
            config.url = this.handleIdInUrl(config.url, data.bodyData, data.queryData);
        }
        if (config.url.indexOf(Fetcher.SOURCE_KEY_TEMPLATE) >= 0) {
            return this.addSourceKeyToUrl(config.url, config.dataSource);
        }
        else if (config.url.indexOf(Fetcher.SOURCE_INDEX_TEMPLATE) >= 0) {
            return this.addSourceIndexToUrl(config.url, config.dataSource);
        }
        else {
            return this._baseUrl + config.url;
        }
    };
    Fetcher.SOURCE_KEY_TEMPLATE = '{dataSourceKey}';
    Fetcher.SOURCE_INDEX_TEMPLATE = '{dataSourceIndex}';
    Fetcher.OBJECT_ID_TEMPLATE = '{id}';
    return Fetcher;
}());
exports.Fetcher = Fetcher;
//# sourceMappingURL=fetcher.js.map