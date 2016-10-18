import * as Query from '../Query';
import { Fetcher } from '../http/fetcher';
import { IDeletedDataSource, IFullDataSource, IFullUser, IGroup, ISimpleGroup, IGroupRights, IAccessRight, IIndexationStatus, IIndexationCallback, IClientState, IDataSourceConfig, IFullAdminAlert } from '../interfaces';
import { Logger } from './../log/Logger';
import { Module } from './Module';
import { IDataSourceRelative } from '../http/IFetchConfig';
export declare class AdminModule extends Module {
    private _logger;
    private _clientState;
    constructor(fetcher: Fetcher, logger: Logger, clientState: IClientState);
    /**
     * Connect a disconnected data-source
     *
     * @param {IDataSourceConfig} data
     * @returns {Promise<boolean>}
     */
    connectDataSource(data: IDataSourceConfig): Promise<boolean>;
    /**
     * Create a new data-source configuration (contains a graph database configuration and an index configuration).
     *
     * @param {ICreateDataSource} data
     * @returns {Promise<boolean>}
     */
    createDataSourceConfig(data: Query.ICreateDataSource): Promise<boolean>;
    /**
     * Delete a data-source configuration that has currently no connected data-source.
     *
     * @param {IDataSourceConfig} [data]
     * @returns {Promise<boolean>}
     */
    deleteDataSourceConfig(data?: IDataSourceConfig): Promise<boolean>;
    /**
     * Delete all data of data-source (visualizations, access-rights, widgets, full-text indexes).
     * Optionally merge visualizations and widgets into another data-source instead of deleting them.
     * Warning: when merging into another data-source, visualizations may break if node and edge IDs
     * are not the same in to target data-source.
     *
     * @param {IDeleteDataSource} data
     * @returns {Promise<IDeletedDataSource>}
     */
    deleteFullDataSource(data: Query.IDeleteDataSource): Promise<IDeletedDataSource>;
    /**
     * Get information for all data-source, including data-sources that do not exist online.
     *
     * @returns {Promise<Array<IFullDataSource>>}
     */
    getDataSourcesList(): Promise<Array<IFullDataSource>>;
    /**
     * Get the list of edge-properties hidden for the given data-source.
     *
     * @param {IDataSourceRelative} [data]
     * @returns {Promise<Array<string>>}
     */
    getHiddenEdgeProperties(data?: IDataSourceRelative): Promise<Array<string>>;
    /**
     * Get the list of node-properties hidden for the given data-source.
     *
     * @param {IDataSourceRelative} [data]
     * @returns {Promise<Array<string>>}
     */
    getHiddenNodeProperties(data?: IDataSourceRelative): Promise<Array<string>>;
    /**
     * Get the list of edge-properties that re not indexed for the given data-source.
     *
     * @param {IDataSourceRelative} [data]
     * @returns {Promise<Array<string>>}
     */
    getNonIndexedEdgeProperties(data?: IDataSourceRelative): Promise<Array<string>>;
    /**
     * Get the list of node-properties that are not indexed for the given data-source.
     *
     * @param {IDataSourceRelative} [data]
     * @returns {Promise<Array<string>>}
     */
    getNonIndexedNodeProperties(data?: IDataSourceRelative): Promise<Array<string>>;
    /**
     * Set the list of edge-properties that are hidden for the given data-source.
     *
     * @param {ISetDataSourceProperties} data
     * @returns {Promise<boolean>}
     */
    setHiddenEdgeProperties(data: Query.ISetDataSourceProperties): Promise<boolean>;
    /**
     * Set the list of node-properties that are hidden for the given data-source.
     *
     * @param {ISetDataSourceProperties} data
     * @returns {Promise<boolean>}
     */
    setHiddenNodeProperties(data: Query.ISetDataSourceProperties): Promise<boolean>;
    /**
     * Set the list of edge-properties that are not indexed for the given data-source.
     *
     * @param {ISetDataSourceProperties} data
     * @returns {Promise<boolean>}
     */
    setNotIndexedEdgeProperties(data: Query.ISetDataSourceProperties): Promise<boolean>;
    /**
     * Set the list of node-properties that are not indexed for the given data-source.
     *
     * @param {ISetDataSourceProperties} data
     * @returns {Promise<boolean>}
     */
    setNotIndexedNodeProperties(data: Query.ISetDataSourceProperties): Promise<boolean>;
    /**
     * Add a new user to the application.
     *
     * @param {ICreateUser} data
     * @returns {Promise<IFullUser>}
     */
    createUser(data: Query.ICreateUser): Promise<IFullUser>;
    /**
     * Deletes a user in the application.
     *
     * @param {number} userId
     * @returns {Promise<boolean>}
     */
    deleteUser(userId: number): Promise<boolean>;
    /**
     * Adds a new group to the application.
     * @param {ICreateGroup} data
     * @returns {Promise<IGroup>}
     */
    createGroup(data: Query.ICreateGroup): Promise<IGroup>;
    /**
     * Deletes a group in the application.
     *
     * @param {number} groupId
     * @returns {Promise<boolean>}
     */
    deleteGroup(groupId: number): Promise<boolean>;
    /**
     * List a group already defined in the database.
     *
     * @param {number} data
     * @returns {Promise<IGroup>}
     */
    getGroup(data: Query.IGetGroup): Promise<IGroup>;
    /**
     * List all the groups already defined in the database and based on the dataSource.
     *
     * @param {IDataSourceRelative} data
     * @returns {Promise<Array<IGroup>>}
     */
    getGroups(data: IDataSourceRelative): Promise<Array<IGroup>>;
    /**
     * List all the groups available.
     *
     * @returns {Promise<ISimpleGroup>}
     */
    getSimpleGroups(): Promise<Array<ISimpleGroup>>;
    /**
     * Get possible targetType, type and action names.
     *
     * @param {IDataSourceRelative} data
     * @returns {Promise<IGroupRights>}
     */
    getGroupsRights(data: IDataSourceRelative): Promise<IGroupRights>;
    /**
     * Bulk-set rights for a whole targetType on one or many groups.
     *
     * @param {IUpdateBatchGroupRights} data
     * @returns {Promise<boolean>}
     */
    updateBatchGroupsRights(data: Query.IUpdateBatchGroupRights): Promise<boolean>;
    /**
     * Overrides a given right with the one specified.
     *
     * @param {IUpdateGroupRights} data
     * @returns {Promise<IAccessRight>}
     */
    updateGroupRights(data: Query.IUpdateGroupRights): Promise<IAccessRight>;
    /**
     * Patches users in the application.
     * Beware, if all the groups for a given user are deleted, the user is added to the default group.
     *
     * @param {IUpdateBatchUser} data
     * @returns {Promise<boolean>}
     */
    updateBatchUser(data: Query.IUpdateBatchUser): Promise<boolean>;
    /**
     * Patches a user in the application
     *
     * @param {IUpdateUser} data
     * @returns {Promise<IFullUser>}
     */
    updateUser(data: Query.IUpdateUser): Promise<IFullUser>;
    /**
     * Sets the configuration of the application
     *
     * @param {IUpdateAppConfig} data
     * @returns {Promise<string>}
     */
    updateConfig(data: Query.IUpdateAppConfig): Promise<string>;
    /**
     * Request to reindex the graph database. One may want to do it after editing the index configuration.
     *
     * @returns {Promise<boolean>}
     */
    startIndexation(): Promise<boolean>;
    /**
     * Get the status of the Search API and return the indexing progress.
     *
     * @returns {Promise<IIndexationStatus>}
     */
    getIndexationStatus(): Promise<IIndexationStatus>;
    /**
     * @callback IIndexationCallback
     * @param {IIndexationStatus} responseStatus
     */
    /**
     * Launch the indexation and return true when finish. Possibility to had callback called each
     * 300ms during indexation.
     *
     * @param {number} timeout
     * @param {IIndexationCallback} [callback]
     * @returns {Promise<boolean>}
     */
    processIndexation(timeout: number, callback?: IIndexationCallback): Promise<boolean>;
    /**
     * Create and return new alert
     * @param {ICreateAlert} data
     * @returns {Promise<IFullAdminAlert>}
     */
    createAlert(data: Query.ICreateAlert): Promise<IFullAdminAlert>;
    /**
     * update existing alert
     * @param {ICreateAlert} data
     * @returns {Promise<IFullAdminAlert>}
     */
    updateAlert(data: Query.IUpdateAlert): Promise<IFullAdminAlert>;
    /**
     * delete existing alert
     * @param {IAlert} data
     * @returns {Promise<boolean>}
     */
    deleteAlert(data: Query.IAlert): Promise<boolean>;
    /**
     * get list of all alerts
     * @param {IDataSourceRelative} data
     * @returns {Promise<IFullAdminAlert>}
     */
    getAlerts(data: IDataSourceRelative): Promise<Array<IFullAdminAlert>>;
    /**
     * get an alert
     * @param {IAlert} data
     * @returns {Promise<IFullAdminAlert>}
     */
    getAlert(data: Query.IAlert): Promise<IFullAdminAlert>;
    /**
     * reset all default styles for a dataSource
     * @param {IDataSourceRelative} data
     * @returns {Promise<boolean>}
     */
    resetStyles(data: IDataSourceRelative): Promise<boolean>;
    /**
     * @callback IIndexationCallback
     * @param {IIndexationStatus} responseStatus
     */
    /**
     * return true when indexation if finished, else launch callback.
     *
     * @param {number} timeout
     * @param {IIndexationCallback} [callback]
     * @returns {Promise<boolean>}
     */
    private listenIndexation(timeout, callback?);
}
