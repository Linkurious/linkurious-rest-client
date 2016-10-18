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
var utils_1 = require('../http/utils');
var Module_1 = require('./Module');
var GraphModule = (function (_super) {
    __extends(GraphModule, _super);
    function GraphModule(fetcher) {
        _super.call(this, fetcher);
    }
    /**
     * Returns an array of <LkNode[]> corresponding to all the shortest paths between two nodes that the user can read.
     *
     * @param {IGetShortestPaths} nodesConfig
     * @returns {Promise<Array<Array<IFullNode|IEdge>>>}
     */
    GraphModule.prototype.getShortestPaths = function (nodesConfig) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/shortestPaths',
            method: 'GET',
            query: nodesConfig
        }).then(function (res) { return res.results; });
    };
    /**
     * Returns an array of LkNode[] matching the sent query.
     *
     * @param {ISendQuery} data
     * @returns {Promise<Array<INode>>}
     */
    GraphModule.prototype.getNodeList = function (data) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/rawQuery',
            method: 'POST',
            body: utils_1.Utils.fixSnakeCase(data)
        });
    };
    return GraphModule;
}(Module_1.Module));
exports.GraphModule = GraphModule;
//# sourceMappingURL=GraphModule.js.map