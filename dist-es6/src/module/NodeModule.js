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
var NodeModule = (function (_super) {
    __extends(NodeModule, _super);
    function NodeModule(fetcher) {
        _super.call(this, fetcher);
    }
    /**
     * Number of nodes in the graph.
     *
     * @returns {Promise<number>}
     */
    NodeModule.prototype.count = function () {
        return this.fetch({
            url: '/{dataSourceKey}/graph/nodes/count',
            method: 'GET'
        }).then(function (res) { return res.count; });
    };
    /**
     * Add a node in the graph.
     *
     * @param {ICreateNode} data
     * @returns {Promise<INode>}
     */
    NodeModule.prototype.create = function (data) {
        var dataToSend = data;
        dataToSend.properties = data.data;
        delete dataToSend.data;
        return this.fetch({
            url: '/{dataSourceKey}/graph/nodes',
            method: 'POST',
            body: data
        });
    };
    /**
     * Delete the node and its adjacent edges from the graph.
     *
     * @param {ItemId}nodeId
     * @returns {Promise<boolean>}
     *
     */
    NodeModule.prototype.deleteOne = function (nodeId) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/nodes/{id}',
            method: 'DELETE',
            body: { id: nodeId }
        }).then(function () { return true; });
    };
    /**
     * Get a node from the graph.
     *
     * @param {IGetNode} [params]
     * @returns {Promise<INode>}
     */
    NodeModule.prototype.getOne = function (params) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/nodes/{id}',
            method: 'GET',
            query: params
        });
    };
    /**
     * Get all adjacent nodes and edges for one or many source nodes (ids). The result is an array of
     * nodes containing the sources nodes (ids) and their neighbors. Edges between sources nodes and
     * neighbors - as well as edges between neighbors themselves - are returned in each node's edges
     * field. If visible_nodes was specified, edges between source nodes or their neighbors and
     * visible nodes are also included.
     *
     * @param {IGetAdjacentItems} data
     * @returns {Promise<Array<INode>>}
     */
    NodeModule.prototype.expand = function (data) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/nodes/expand',
            method: 'POST',
            body: utils_1.Utils.fixSnakeCase(data)
        });
    };
    /**
     * Get node-categories and edge-types of neighbors
     *
     * @param {Array<number>} data
     * @returns {Promise<Array<IDigest>>}
     */
    NodeModule.prototype.getNeighborsCategories = function (data) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/neighborhood/digest',
            method: 'POST',
            body: data
        });
    };
    /**
     * Modify the properties of a node in the graph by the given ones, and keeps the other properties of the node.
     *
     * @param {IUpdateNode} data
     * @returns {Promise<INode>}
     */
    NodeModule.prototype.update = function (data) {
        var dataToSend = data;
        dataToSend.deleteProperties = data.deletedData;
        dataToSend.properties = data.data;
        delete dataToSend.deletedData;
        delete dataToSend.data;
        return this.fetch({
            url: '/{dataSourceKey}/graph/nodes/{id}',
            method: 'PATCH',
            body: utils_1.Utils.fixSnakeCase(data)
        });
    };
    /**
     * List all node-type properties (aggregated from all nodeTypes)
     *
     * @param {IGetItemProperties} [params]
     * @returns {Promise<Array<IProperty>>}
     */
    NodeModule.prototype.getProperties = function (params) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/schema/nodeTypes/properties',
            method: 'GET',
            query: params
        }).then(function (res) { return res.properties; });
    };
    /**
     * List node-types indexed by Linkurious
     *
     * @param {IGetItemTypes} [params]
     * @returns {Promise<Array<IItemType>>}
     */
    NodeModule.prototype.getTypes = function (params) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/schema/nodeTypes',
            method: 'GET',
            query: params
        }).then(function (res) { return res.nodeTypes; });
    };
    return NodeModule;
}(Module_1.Module));
exports.NodeModule = NodeModule;
//# sourceMappingURL=NodeModule.js.map