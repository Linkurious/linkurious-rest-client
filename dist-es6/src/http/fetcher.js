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
const LinkuriousError_1 = require('./../LinkuriousError');
const DefaultHttpDriver_1 = require('./DefaultHttpDriver');
const utils_1 = require('./utils');
class Fetcher {
    constructor(logger, clientState, host, httpDriver) {
        this._httpDriver = httpDriver ? httpDriver : new DefaultHttpDriver_1.DefaultHttpDriver();
        this._logger = logger;
        this._clientState = clientState;
        this._host = host;
        this._baseUrl = this._host + '/api';
    }
    /**
     * HTTPDriver wrapper method
     *
     * @param {IFetchConfig} config
     * @returns {Promise.<*>} the response body
     */
    fetch(config) {
        let data = {
            queryData: config.query,
            bodyData: config.body
        };
        try {
            config.url = this.transformUrl(config, data);
        }
        catch (lkError) {
            return Promise.reject(lkError);
        }
        let responsePromise;
        if (config.method === 'GET') {
            responsePromise = this._httpDriver[config.method](config.url, utils_1.Utils.fixSnakeCase(data.queryData));
        }
        else {
            responsePromise = this._httpDriver[config.method](config.url, data.bodyData, utils_1.Utils.fixSnakeCase(data.queryData));
        }
        return responsePromise.catch((error) => {
            // console.log(JSON.stringify(error.stack.split(/\s*\n\s*/), null, ' '));
            // create a linkurious error from "hard" errors
            return Promise.reject(LinkuriousError_1.LinkuriousError.fromError(error));
        }).then((response) => {
            // create a linkurious error from "soft" error
            if (LinkuriousError_1.LinkuriousError.isError(response)) {
                let linkuriousError = LinkuriousError_1.LinkuriousError.fromHttpResponse(response);
                return Promise.reject(linkuriousError);
            }
            // resolve with response body in case of success
            return response.body;
        }).catch((error) => {
            // logging interceptor
            this._logger.error(error);
            return Promise.reject(error);
        });
    }
    addSourceKeyToUrl(url, explicitSource) {
        if (explicitSource) {
            return this._baseUrl + url.replace(Fetcher.SOURCE_KEY_TEMPLATE, explicitSource.dataSourceKey);
        }
        else if (this._clientState.currentSource) {
            return this._baseUrl + url.replace(Fetcher.SOURCE_KEY_TEMPLATE, this._clientState.currentSource.key);
        }
        else {
            throw LinkuriousError_1.LinkuriousError.fromClientError('state_error', `You need to set a current source to fetch this API (${url}).`);
        }
    }
    addSourceIndexToUrl(url, explicitSource) {
        if (explicitSource) {
            return this._baseUrl + url.replace(Fetcher.SOURCE_INDEX_TEMPLATE, explicitSource.dataSourceIndex + '');
        }
        else if (this._clientState.currentSource) {
            return this._baseUrl + url.replace(Fetcher.SOURCE_INDEX_TEMPLATE, this._clientState.currentSource.key);
        }
        else {
            throw LinkuriousError_1.LinkuriousError.fromClientError('state_error', `You need to set a current source to fetch this API (${url}).`);
        }
    }
    handleIdInUrl(url, body, query) {
        if (body) {
            let id = body.id;
            delete body.id;
            return url.replace(Fetcher.OBJECT_ID_TEMPLATE, id + '');
        }
        if (query) {
            let id = query.id;
            delete query.id;
            return url.replace(Fetcher.OBJECT_ID_TEMPLATE, id + '');
        }
        throw LinkuriousError_1.LinkuriousError.fromClientError('state_error', `You need an ID to fetch this API (${url}).`);
    }
    transformUrl(config, data) {
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
    }
}
Fetcher.SOURCE_KEY_TEMPLATE = '{dataSourceKey}';
Fetcher.SOURCE_INDEX_TEMPLATE = '{dataSourceIndex}';
Fetcher.OBJECT_ID_TEMPLATE = '{id}';
exports.Fetcher = Fetcher;
//# sourceMappingURL=fetcher.js.map