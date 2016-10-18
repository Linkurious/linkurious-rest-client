import * as Query from '../Query';
import { ISearchFullItems, IUser, ISearchEdgesInDirectory, ISearchNodesInDirectory, IEdge, IFullNode } from '../interfaces';
import { Module } from './Module';
import { Fetcher } from '../http/fetcher';
export declare class SearchModule extends Module {
    constructor(fetcher: Fetcher);
    /**
     * Search for nodes based on a query string and optional parameters. Return a list of full Nodes.
     *
     * @param {ISearchItemList} params
     * @returns {Promise<Array<ISearchItemList>>}
     */
    fullNodes(params: Query.ISearchItemList): Promise<Array<IFullNode>>;
    /**
     * Search for edges based on a query string and optional parameters. Return a list of full Nodes.
     *
     * @param {ISearchItemList} params
     * @returns {Promise<Array<ISearchItemList>>}
     */
    fullEdges(params: Query.ISearchItemList): Promise<Array<IEdge>>;
    /**
     * Search for nodes based on a query string and optional parameters. Return formatted results for
     * the Linkurious client.
     *
     * @param {ISearchItemList} params
     * @returns {Promise<ISearchFullItems>}
     */
    nodes(params: Query.ISearchItemList): Promise<ISearchFullItems>;
    /**
     * Search for edges based on a query string and optional parameters. Return formatted results for
     * the Linkurious client.
     *
     * @param {ISearchItemList} params
     * @returns {Promise<ISearchFullItems>}
     */
    edges(params: Query.ISearchItemList): Promise<ISearchFullItems>;
    /**
     * Find a list of users matching a filter (on username or email)
     *
     * @param {IGetUserList} data
     * @returns {Promise<Array<IUser>>}
     */
    users(data: Query.IGetUserList): Promise<Array<IUser>>;
    /**
     * get a list of nodes for directory.
     *
     * @param {IGetDirectory} data
     * @returns {Promise<ISearchNodesInDirectory>}
     */
    NodesInDirectory(data: Query.IGetDirectory): Promise<ISearchNodesInDirectory>;
    /**
     * get a list of edges for directory.
     *
     * @param {IGetDirectory} data
     * @returns {Promise<ISearchEdgesInDirectory>}
     */
    EdgesInDirectory(data: Query.IGetDirectory): Promise<ISearchEdgesInDirectory>;
}
