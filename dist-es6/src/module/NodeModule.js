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
class NodeModule extends Module_1.Module {
    constructor(fetcher) {
        super(fetcher);
    }
    /**
     * Number of nodes in the graph.
     *
     * @returns {Promise<number>}
     */
    count() {
        return this.fetch({
            url: '/{dataSourceKey}/graph/nodes/count',
            method: 'GET'
        }).then((res) => res.count);
    }
    /**
     * Add a node in the graph.
     *
     * @param {ICreateNode} data
     * @returns {Promise<INode>}
     */
    create(data) {
        let dataToSend = data;
        dataToSend.properties = data.data;
        delete dataToSend.data;
        return this.fetch({
            url: '/{dataSourceKey}/graph/nodes',
            method: 'POST',
            body: data
        });
    }
    /**
     * Delete the node and its adjacent edges from the graph.
     *
     * @param {ItemId}nodeId
     * @returns {Promise<boolean>}
     *
     */
    deleteOne(nodeId) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/nodes/{id}',
            method: 'DELETE',
            body: { id: nodeId }
        }).then(() => true);
    }
    /**
     * Get a node from the graph.
     *
     * @param {IGetNode} [params]
     * @returns {Promise<INode>}
     */
    getOne(params) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/nodes/{id}',
            method: 'GET',
            query: params
        });
    }
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
    expand(data) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/nodes/expand',
            method: 'POST',
            body: utils_1.Utils.fixSnakeCase(data)
        });
    }
    /**
     * Get node-categories and edge-types of neighbors
     *
     * @param {Array<number>} data
     * @returns {Promise<Array<IDigest>>}
     */
    getNeighborsCategories(data) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/neighborhood/digest',
            method: 'POST',
            body: data
        });
    }
    /**
     * Modify the properties of a node in the graph by the given ones, and keeps the other properties of the node.
     *
     * @param {IUpdateNode} data
     * @returns {Promise<INode>}
     */
    update(data) {
        let dataToSend = data;
        dataToSend.deleteProperties = data.deletedData;
        dataToSend.properties = data.data;
        delete dataToSend.deletedData;
        delete dataToSend.data;
        return this.fetch({
            url: '/{dataSourceKey}/graph/nodes/{id}',
            method: 'PATCH',
            body: utils_1.Utils.fixSnakeCase(data)
        });
    }
    /**
     * List all node-type properties (aggregated from all nodeTypes)
     *
     * @param {IGetItemProperties} [params]
     * @returns {Promise<Array<IProperty>>}
     */
    getProperties(params) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/schema/nodeTypes/properties',
            method: 'GET',
            query: params
        }).then((res) => res.properties);
    }
    /**
     * List node-types indexed by Linkurious
     *
     * @param {IGetItemTypes} [params]
     * @returns {Promise<Array<IItemType>>}
     */
    getTypes(params) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/schema/nodeTypes',
            method: 'GET',
            query: params
        }).then((res) => res.nodeTypes);
    }
}
exports.NodeModule = NodeModule;
//# sourceMappingURL=NodeModule.js.map