import * as Query from '../Query';
import { INode, IFullNode, ItemId, IDigest, IProperty, IItemType } from '../interfaces';
import { Module } from './Module';
import { Fetcher } from '../http/fetcher';
export declare class NodeModule extends Module {
    constructor(fetcher: Fetcher);
    /**
     * Number of nodes in the graph.
     *
     * @returns {Promise<number>}
     */
    count(): Promise<number>;
    /**
     * Add a node in the graph.
     *
     * @param {ICreateNode} data
     * @returns {Promise<INode>}
     */
    create(data: Query.ICreateNode): Promise<INode>;
    /**
     * Delete the node and its adjacent edges from the graph.
     *
     * @param {ItemId}nodeId
     * @returns {Promise<boolean>}
     *
     */
    deleteOne(nodeId: ItemId): Promise<boolean>;
    /**
     * Get a node from the graph.
     *
     * @param {IGetNode} [params]
     * @returns {Promise<INode>}
     */
    getOne(params?: Query.IGetNode): Promise<IFullNode>;
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
    expand(data: Query.IGetAdjacentItems): Promise<Array<INode>>;
    /**
     * Get node-categories and edge-types of neighbors
     *
     * @param {Array<number>} data
     * @returns {Promise<Array<IDigest>>}
     */
    getNeighborsCategories(data: Query.IGetNeighborsCategories): Promise<Array<IDigest>>;
    /**
     * Modify the properties of a node in the graph by the given ones, and keeps the other properties of the node.
     *
     * @param {IUpdateNode} data
     * @returns {Promise<INode>}
     */
    update(data: Query.IUpdateNode): Promise<INode>;
    /**
     * List all node-type properties (aggregated from all nodeTypes)
     *
     * @param {IGetItemProperties} [params]
     * @returns {Promise<Array<IProperty>>}
     */
    getProperties(params?: Query.IGetItemProperties): Promise<Array<IProperty>>;
    /**
     * List node-types indexed by Linkurious
     *
     * @param {IGetItemTypes} [params]
     * @returns {Promise<Array<IItemType>>}
     */
    getTypes(params?: Query.IGetItemTypes): Promise<Array<IItemType>>;
}
