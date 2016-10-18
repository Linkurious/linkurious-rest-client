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
class EdgeModule extends Module_1.Module {
    constructor(fetcher) {
        super(fetcher);
    }
    /**
     * return the number of edges in the graph.
     *
     * @returns {Promise<number>}
     */
    count() {
        return this.fetch({
            url: '/{dataSourceKey}/graph/edges/count',
            method: 'GET'
        }).then((res) => res.count);
    }
    /**
     * Add an edge in the graph.
     *
     * @param {ICreateEdge} data
     * @returns {Promise<IEdge>}
     */
    create(data) {
        let dataToSend = data;
        dataToSend.properties = data.data;
        delete dataToSend.data;
        return this.fetch({
            url: '/{dataSourceKey}/graph/edges',
            method: 'POST',
            body: dataToSend
        });
    }
    /**
     * Modify the properties of an edge in the graph by the given ones. Keeps the other properties of
     * the edge unchanged.
     *
     * @param {IUpdateEdge} data
     * @returns {Promise<IEdge>}
     */
    update(data) {
        let dataToSend = data;
        dataToSend.properties = data.data;
        dataToSend.deleteProperties = data.deletedData;
        delete dataToSend.data;
        delete dataToSend.deletedData;
        return this.fetch({
            url: '/{dataSourceKey}/graph/edges/{id}',
            method: 'PATCH',
            body: data
        });
    }
    /**
     * Delete a edge from the graph.
     *
     * @param {ItemId} edgeId
     * @returns {Promise<boolean>}
     */
    deleteOne(edgeId) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/edges/{id}',
            method: 'DELETE',
            body: { id: edgeId }
        }).then(() => true);
    }
    /**
     * Get the adjacent edges of a node from the graph.
     * If source is provided, return outgoing edges only.
     * Else if target is provided, return incoming edges only.
     * Else if adjacent is provided, return all adjacent edges.
     *
     * @param {IGetAdjacentEdges} data
     * @returns {Promise<Array<IEdge>>}
     */
    getAdjacentFromNode(data) {
        // clone
        let query = JSON.parse(JSON.stringify(data));
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
    }
    /**
     * Get an edge of the graph.
     *
     * @param {ItemId} edgeId
     * @returns {Promise<IEdge>}
     */
    getOne(edgeId) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/edges/{id}',
            method: 'GET',
            body: { id: edgeId }
        });
    }
    /**
     * List all edgeType properties (aggregated from all edgeTypes)
     *
     * @param {IGetItemProperties} [params]
     * @returns {Promise<Array<IProperty>>}
     */
    getProperties(params) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/schema/edgeTypes/properties',
            method: 'GET',
            query: params
        }).then((res) => res.properties);
    }
    /**
     * List edge-types indexed by linkurious
     *
     * @param {IGetEdgeTypes} [params]
     * @returns {Promise<Array<IItemType>>}
     */
    getTypes(params) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/schema/edgeTypes',
            method: 'GET',
            query: params
        }).then((res) => res.edgeTypes);
    }
}
exports.EdgeModule = EdgeModule;
//# sourceMappingURL=EdgeModule.js.map