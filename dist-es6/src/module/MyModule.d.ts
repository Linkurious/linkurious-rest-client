import * as Query from '../Query';
import { IGraphQuery, IFullUser } from '../interfaces';
import { Module } from './Module';
import { Fetcher } from '../http/fetcher';
export declare class MyModule extends Module {
    constructor(fetcher: Fetcher);
    /**
     * get authenticated user infos
     *
     * @returns {Promise<IFullUser>}
     */
    infos(): Promise<IFullUser>;
    /**
     * Check if the user is authenticated.
     *
     * @returns {Promise<boolean>}
     */
    IsAuth(): Promise<boolean>;
    /**
     * Check if the user is authenticated as an admin.
     *
     * @returns {Promise<boolean>}
     */
    IsAdmin(): Promise<boolean>;
    /**
     * Delete a saved Graph Query owned by the current user
     *
     * @param {number} graphQueryId
     * @returns {Promise<boolean>}
     */
    deleteGraphQuery(graphQueryId: number): Promise<boolean>;
    /**
     * Returns a saved GraphModule Query owned by the current user
     *
     * @param {number} graphQueryId
     * @returns {Promise<IGraphQuery>}
     */
    getGraphQuery(graphQueryId: number): Promise<IGraphQuery>;
    /**
     * Returns all saved GraphModule Queries owned by the current user
     *
     * @returns {Promise<Array<IGraphQuery>>}
     */
    getAllGraphQueries(): Promise<Array<IGraphQuery>>;
    /**
     * Save and Returns the created GraphQuery
     * @param {ICreateGraphQuery} data
     * @returns {Promise<IGraphQuery>}
     */
    saveGraphQuery(data: Query.ICreateGraphQuery): Promise<IGraphQuery>;
    /**
     * Update a graph query owned but the current user
     *
     * @param {IUpdateGraphQuery} data
     * @returns {Promise<IGraphQuery>}
     */
    updateGraphQuery(data: Query.IUpdateGraphQuery): Promise<boolean>;
}
