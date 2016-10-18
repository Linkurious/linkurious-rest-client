import * as Query from '../Query';
import { INode, IEdge, IFullNode } from '../interfaces';
import { Module } from './Module';
import { Fetcher } from '../http/fetcher';
export declare class GraphModule extends Module {
    constructor(fetcher: Fetcher);
    /**
     * Get the edit-versions for nodes and edges.
     *
     * @param {IGetItemVersions} data
     * @returns {Promise}
     */
    getItemsVersions(data: Query.IGetItemVersions): Promise<any>;
    /**
     * Returns an array of <LkNode[]> corresponding to all the shortest paths between two nodes that the user can read.
     *
     * @param {IGetShortestPaths} nodesConfig
     * @returns {Promise<Array<Array<IFullNode|IEdge>>>}
     */
    getShortestPaths(nodesConfig: Query.IGetShortestPaths): Promise<Array<Array<IFullNode | IEdge>>>;
    /**
     * Returns an array of LkNode[] matching the sent query.
     *
     * @param {ISendQuery} data
     * @returns {Promise<Array<INode>>}
     */
    getNodeList(data: Query.ISendQuery): Promise<Array<INode>>;
}
