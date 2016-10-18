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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Module_1 = require('./Module');
var MyModule = (function (_super) {
    __extends(MyModule, _super);
    function MyModule(fetcher) {
        _super.call(this, fetcher);
    }
    /**
     * Check if the user is authenticated.
     *
     * @returns {Promise<boolean>}
     */
    MyModule.prototype.IsAuth = function () {
        return this.fetch({
            url: '/auth/authenticated',
            method: 'GET'
        }).then(function () { return true; });
    };
    /**
     * Check if the user is authenticated as an admin.
     *
     * @returns {Promise<boolean>}
     */
    MyModule.prototype.IsAdmin = function () {
        return this.fetch({
            url: '/auth/admin',
            method: 'GET'
        }).then(function () { return true; });
    };
    /**
     * Delete a saved Graph Query owned by the current user
     *
     * @param {number} graphQueryId
     * @returns {Promise<boolean>}
     */
    MyModule.prototype.deleteGraphQuery = function (graphQueryId) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/my/rawQuery/{id}',
            method: 'DELETE',
            body: { id: graphQueryId }
        }).then(function () { return true; });
    };
    /**
     * Returns a saved GraphModule Query owned by the current user
     *
     * @param {number} graphQueryId
     * @returns {Promise<IGraphQuery>}
     */
    MyModule.prototype.getGraphQuery = function (graphQueryId) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/my/rawQuery/{id}',
            method: 'GET',
            query: { id: graphQueryId }
        });
    };
    /**
     * Returns all saved GraphModule Queries owned by the current user
     *
     * @returns {Promise<Array<IGraphQuery>>}
     */
    MyModule.prototype.getAllGraphQueries = function () {
        return this.fetch({
            url: '/{dataSourceKey}/graph/my/rawQuery/all',
            method: 'GET'
        });
    };
    /**
     * Save and Returns the created GraphQuery
     * @param {ICreateGraphQuery} data
     * @returns {Promise<IGraphQuery>}
     */
    MyModule.prototype.saveGraphQuery = function (data) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/my/rawQuery',
            method: 'POST',
            body: data
        });
    };
    /**
     * Update a graph query owned but the current user
     *
     * @param {IUpdateGraphQuery} data
     * @returns {Promise<IGraphQuery>}
     */
    MyModule.prototype.updateGraphQuery = function (data) {
        var body = JSON.parse(JSON.stringify(data));
        body.properties = {
            name: data.name,
            content: data.content
        };
        body.name = undefined;
        body.content = undefined;
        return this.fetch({
            url: '/{dataSourceKey}/graph/my/rawQuery/{id}',
            method: 'PATCH',
            body: body
        });
    };
    return MyModule;
}(Module_1.Module));
exports.MyModule = MyModule;
//# sourceMappingURL=MyModule.js.map