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
var EdgeModule = (function (_super) {
    __extends(EdgeModule, _super);
    function EdgeModule(fetcher) {
        _super.call(this, fetcher);
    }
    /**
     * return the number of edges in the graph.
     *
     * @returns {Promise<number>}
     */
    EdgeModule.prototype.count = function () {
        return this.fetch({
            url: '/{dataSourceKey}/graph/edges/count',
            method: 'GET'
        }).then(function (res) { return res.count; });
    };
    /**
     * Add an edge in the graph.
     *
     * @param {ICreateEdge} data
     * @returns {Promise<IEdge>}
     */
    EdgeModule.prototype.create = function (data) {
        var dataToSend = data;
        dataToSend.properties = data.data;
        delete dataToSend.data;
        return this.fetch({
            url: '/{dataSourceKey}/graph/edges',
            method: 'POST',
            body: dataToSend
        });
    };
    /**
     * Modify the properties of an edge in the graph by the given ones. Keeps the other properties of
     * the edge unchanged.
     *
     * @param {IUpdateEdge} data
     * @returns {Promise<IEdge>}
     */
    EdgeModule.prototype.update = function (data) {
        var dataToSend = data;
        dataToSend.properties = data.data;
        dataToSend.deleteProperties = data.deletedData;
        delete dataToSend.data;
        delete dataToSend.deletedData;
        return this.fetch({
            url: '/{dataSourceKey}/graph/edges/{id}',
            method: 'PATCH',
            body: data
        });
    };
    /**
     * Delete a edge from the graph.
     *
     * @param {ItemId} edgeId
     * @returns {Promise<boolean>}
     */
    EdgeModule.prototype.deleteOne = function (edgeId) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/edges/{id}',
            method: 'DELETE',
            body: { id: edgeId }
        }).then(function () { return true; });
    };
    /**
     * Get the adjacent edges of a node from the graph.
     * If source is provided, return outgoing edges only.
     * Else if target is provided, return incoming edges only.
     * Else if adjacent is provided, return all adjacent edges.
     *
     * @param {IGetAdjacentEdges} data
     * @returns {Promise<Array<IEdge>>}
     */
    EdgeModule.prototype.getAdjacentFromNode = function (data) {
        // clone
        var query = JSON.parse(JSON.stringify(data));
        if (query.orientation === 'in') {
            query.source = data.nodeId;
        }
        if (data.orientation === 'out') {
            query.target = data.nodeId;
        }
        if (data.orientation === 'both') {
            query.adjacent = data.nodeId;
        }
        query.nodeId = undefined;
        query.orientation = undefined;
        return this.fetch({
            url: '/{dataSourceKey}/graph/edges',
            method: 'GET',
            query: query
        });
    };
    /**
     * Get an edge of the graph.
     *
     * @param {ItemId} edgeId
     * @returns {Promise<IEdge>}
     */
    EdgeModule.prototype.getOne = function (edgeId) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/edges/{id}',
            method: 'GET',
            body: { id: edgeId }
        });
    };
    /**
     * List all edgeType properties (aggregated from all edgeTypes)
     *
     * @param {IGetItemProperties} [params]
     * @returns {Promise<Array<IProperty>>}
     */
    EdgeModule.prototype.getProperties = function (params) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/schema/edgeTypes/properties',
            method: 'GET',
            query: params
        }).then(function (res) { return res.properties; });
    };
    /**
     * List edge-types indexed by linkurious
     *
     * @param {IGetEdgeTypes} [params]
     * @returns {Promise<Array<IItemType>>}
     */
    EdgeModule.prototype.getTypes = function (params) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/schema/edgeTypes',
            method: 'GET',
            query: params
        }).then(function (res) { return res.edgeTypes; });
    };
    return EdgeModule;
}(Module_1.Module));
exports.EdgeModule = EdgeModule;
//# sourceMappingURL=EdgeModule.js.map