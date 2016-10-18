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
const utils_1 = require('../http/utils');
const Module_1 = require('./Module');
class GraphModule extends Module_1.Module {
    constructor(fetcher) {
        super(fetcher);
    }
    /**
     * Get the edit-versions for nodes and edges.
     *
     * @param {IGetItemVersions} data
     * @returns {Promise}
     */
    getItemsVersions(data) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/versions',
            method: 'POST',
            body: data,
            dataSource: this.setDataSourceKey(data.dataSourceKey)
        });
    }
    /**
     * Returns an array of <LkNode[]> corresponding to all the shortest paths between two nodes that the user can read.
     *
     * @param {IGetShortestPaths} nodesConfig
     * @returns {Promise<Array<Array<IFullNode|IEdge>>>}
     */
    getShortestPaths(nodesConfig) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/shortestPaths',
            method: 'GET',
            query: nodesConfig
        }).then((res) => res.results);
    }
    /**
     * Returns an array of LkNode[] matching the sent query.
     *
     * @param {ISendQuery} data
     * @returns {Promise<Array<INode>>}
     */
    getNodeList(data) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/rawQuery',
            method: 'POST',
            body: utils_1.Utils.fixSnakeCase(data)
        });
    }
}
exports.GraphModule = GraphModule;
//# sourceMappingURL=GraphModule.js.map