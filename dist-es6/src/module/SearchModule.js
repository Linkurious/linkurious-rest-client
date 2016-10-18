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
var SearchModule = (function (_super) {
    __extends(SearchModule, _super);
    function SearchModule(fetcher) {
        _super.call(this, fetcher);
    }
    /**
     * Search for nodes based on a query string and optional parameters. Return a list of full Nodes.
     *
     * @param {ISearchItemList} params
     * @returns {Promise<Array<ISearchItemList>>}
     */
    SearchModule.prototype.fullNodes = function (params) {
        return this.fetch({
            url: '/{dataSourceKey}/search/nodes/full',
            method: 'GET',
            query: params
        });
    };
    /**
     * Search for edges based on a query string and optional parameters. Return a list of full Nodes.
     *
     * @param {ISearchItemList} params
     * @returns {Promise<Array<ISearchItemList>>}
     */
    SearchModule.prototype.fullEdges = function (params) {
        return this.fetch({
            url: '/{dataSourceKey}/search/edges/full',
            method: 'GET',
            query: params
        });
    };
    /**
     * Search for nodes based on a query string and optional parameters. Return formatted results for
     * the Linkurious client.
     *
     * @param {ISearchItemList} params
     * @returns {Promise<ISearchFullItems>}
     */
    SearchModule.prototype.nodes = function (params) {
        return this.fetch({
            url: '/{dataSourceKey}/search/nodes',
            method: 'GET',
            query: params
        });
    };
    /**
     * Search for edges based on a query string and optional parameters. Return formatted results for
     * the Linkurious client.
     *
     * @param {ISearchItemList} params
     * @returns {Promise<ISearchFullItems>}
     */
    SearchModule.prototype.edges = function (params) {
        return this.fetch({
            url: '/{dataSourceKey}/search/edges',
            method: 'GET',
            query: params
        });
    };
    /**
     * Find a list of users matching a filter (on username or email)
     *
     * @param {IGetUserList} data
     * @returns {Promise<Array<IUser>>}
     */
    SearchModule.prototype.users = function (data) {
        return this.fetch({
            url: '/findUsers',
            method: 'GET',
            query: data
        });
    };
    /**
     * get a list of nodes for directory.
     *
     * @param {IGetDirectory} data
     * @returns {Promise<ISearchNodesInDirectory>}
     */
    SearchModule.prototype.NodesInDirectory = function (data) {
        var body = data;
        body.type = 'nodes';
        return this.fetch({
            url: '/{dataSourceKey}/directory',
            method: 'POST',
            body: body
        });
    };
    /**
     * get a list of edges for directory.
     *
     * @param {IGetDirectory} data
     * @returns {Promise<ISearchEdgesInDirectory>}
     */
    SearchModule.prototype.EdgesInDirectory = function (data) {
        var body = data;
        body.type = 'edges';
        return this.fetch({
            url: '/{dataSourceKey}/directory',
            method: 'POST',
            body: body
        });
    };
    return SearchModule;
}(Module_1.Module));
exports.SearchModule = SearchModule;
//# sourceMappingURL=SearchModule.js.map