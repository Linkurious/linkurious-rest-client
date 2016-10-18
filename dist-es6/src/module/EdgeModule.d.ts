import * as Query from '../Query';
import { Module } from './Module';
import { IEdge, ItemId, IProperty, IItemType } from '../interfaces';
import { Fetcher } from '../http/fetcher';
export declare class EdgeModule extends Module {
    constructor(fetcher: Fetcher);
    /**
     * return the number of edges in the graph.
     *
     * @returns {Promise<number>}
     */
    count(): Promise<number>;
    /**
     * Add an edge in the graph.
     *
     * @param {ICreateEdge} data
     * @returns {Promise<IEdge>}
     */
    create(data: Query.ICreateEdge): Promise<IEdge>;
    /**
     * Modify the properties of an edge in the graph by the given ones. Keeps the other properties of
     * the edge unchanged.
     *
     * @param {IUpdateEdge} data
     * @returns {Promise<IEdge>}
     */
    update(data: Query.IUpdateEdge): Promise<IEdge>;
    /**
     * Delete a edge from the graph.
     *
     * @param {ItemId} edgeId
     * @returns {Promise<boolean>}
     */
    deleteOne(edgeId: ItemId): Promise<boolean>;
    /**
     * Get the adjacent edges of a node from the graph.
     * If source is provided, return outgoing edges only.
     * Else if target is provided, return incoming edges only.
     * Else if adjacent is provided, return all adjacent edges.
     *
     * @param {IGetAdjacentEdges} data
     * @returns {Promise<Array<IEdge>>}
     */
    getAdjacentFromNode(data: Query.IGetAdjacentEdges): Promise<Array<IEdge>>;
    /**
     * Get an edge of the graph.
     *
     * @param {ItemId} edgeId
     * @returns {Promise<IEdge>}
     */
    getOne(edgeId: ItemId): Promise<IEdge>;
    /**
     * List all edgeType properties (aggregated from all edgeTypes)
     *
     * @param {IGetItemProperties} [params]
     * @returns {Promise<Array<IProperty>>}
     */
    getProperties(params?: Query.IGetItemProperties): Promise<Array<IProperty>>;
    /**
     * List edge-types indexed by linkurious
     *
     * @param {IGetEdgeTypes} [params]
     * @returns {Promise<Array<IItemType>>}
     */
    getTypes(params?: Query.IGetEdgeTypes): Promise<Array<IItemType>>;
}
