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
const Module_1 = require('./Module');
class SearchModule extends Module_1.Module {
    constructor(fetcher) {
        super(fetcher);
    }
    /**
     * Search for nodes based on a query string and optional parameters. Return a list of full Nodes.
     *
     * @param {ISearchItemList} params
     * @returns {Promise<Array<ISearchItemList>>}
     */
    fullNodes(params) {
        return this.fetch({
            url: '/{dataSourceKey}/search/nodes/full',
            method: 'GET',
            query: params
        });
    }
    /**
     * Search for edges based on a query string and optional parameters. Return a list of full Nodes.
     *
     * @param {ISearchItemList} params
     * @returns {Promise<Array<ISearchItemList>>}
     */
    fullEdges(params) {
        return this.fetch({
            url: '/{dataSourceKey}/search/edges/full',
            method: 'GET',
            query: params
        });
    }
    /**
     * Search for nodes based on a query string and optional parameters. Return formatted results for
     * the Linkurious client.
     *
     * @param {ISearchItemList} params
     * @returns {Promise<ISearchFullItems>}
     */
    nodes(params) {
        return this.fetch({
            url: '/{dataSourceKey}/search/nodes',
            method: 'GET',
            query: params
        });
    }
    /**
     * Search for edges based on a query string and optional parameters. Return formatted results for
     * the Linkurious client.
     *
     * @param {ISearchItemList} params
     * @returns {Promise<ISearchFullItems>}
     */
    edges(params) {
        return this.fetch({
            url: '/{dataSourceKey}/search/edges',
            method: 'GET',
            query: params
        });
    }
    /**
     * Find a list of users matching a filter (on username or email)
     *
     * @param {IGetUserList} data
     * @returns {Promise<Array<IUser>>}
     */
    users(data) {
        return this.fetch({
            url: '/findUsers',
            method: 'GET',
            query: data
        });
    }
    /**
     * get a list of nodes for directory.
     *
     * @param {IGetDirectory} data
     * @returns {Promise<ISearchNodesInDirectory>}
     */
    NodesInDirectory(data) {
        let body = data;
        body.type = 'nodes';
        return this.fetch({
            url: '/{dataSourceKey}/directory',
            method: 'POST',
            body: body
        });
    }
    /**
     * get a list of edges for directory.
     *
     * @param {IGetDirectory} data
     * @returns {Promise<ISearchEdgesInDirectory>}
     */
    EdgesInDirectory(data) {
        let body = data;
        body.type = 'edges';
        return this.fetch({
            url: '/{dataSourceKey}/directory',
            method: 'POST',
            body: body
        });
    }
}
exports.SearchModule = SearchModule;
//# sourceMappingURL=SearchModule.js.map