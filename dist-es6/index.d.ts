/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-04-25.
 *
 * File:
 * Description :
 */
import { LogLevel } from './src/log/Logger';
import { ILoggerDriver } from './src/log/ILoggerDriver';
import { AdminModule } from './src/module/AdminModule';
import { MyModule } from './src/module/MyModule';
import { GraphModule } from './src/module/GraphModule';
import { EdgeModule } from './src/module/EdgeModule';
import { NodeModule } from './src/module/NodeModule';
import { SearchModule } from './src/module/SearchModule';
import { VisualizationModule } from './src/module/VisualizationModule';
import { AlertModule } from './src/module/AlertModule';
import * as Query from './src/Query';
import { IDataSource, IFullUser, IDataSourceState, IAppStatus, IAppVersion, IAppConfig, ISchema, IClientState } from './src/interfaces';
export declare class Linkurious {
    private _fetcher;
    private _clientState;
    private _logger;
    private _admin;
    private _my;
    private _edge;
    private _graph;
    private _node;
    private _search;
    private _visualization;
    private _alert;
    state: IClientState;
    /**
     *
     * @param {string} host           - Host URL of the linkurious server
     * @param {string} logLevel       - Level of log wanted
     * @param {object} [loggerDriver] - logger object
     */
    constructor(host: string, logLevel: LogLevel, loggerDriver?: ILoggerDriver);
    /**
     * @returns {AdminModule}
     */
    admin: AdminModule;
    /**
     * @returns {MyModule}
     */
    my: MyModule;
    /**
     * @returns {GraphModule}
     */
    graph: GraphModule;
    /**
     * @returns {EdgeModule}
     */
    edge: EdgeModule;
    /**
     * @returns {NodeModule}
     */
    node: NodeModule;
    /**
     * @returns {SearchModule}
     */
    search: SearchModule;
    /**
     * @returns {VisualizationModule}
     */
    visualization: VisualizationModule;
    /**
     * @returns {AlertModule}
     */
    alerts: AlertModule;
    /**
     * Process to login of the corresponding user and return it.
     *
     * @param {ILoginUser} data
     * @returns {Promise<boolean>}
     */
    login(data: Query.ILoginUser): Promise<any>;
    oAuthAzure(): Promise<boolean>;
    /**
     * Clear the user session.
     *
     * @returns {Promise<string>}
     */
    logout(): Promise<string>;
    /**
     * Update the current user connected
     *
     * @param {IUpdateUser} data
     * @returns {Promise<IFullUser>}
     */
    updateCurrentUser(data: Query.IUpdateUser): Promise<IFullUser>;
    /**
     * Get the status of the all data-sources.
     *
     * @returns {Promise<IDataSourceState>}
     */
    getSourceList(): Promise<Array<IDataSourceState>>;
    /**
     * Set the currentSource to the first source connected
     *
     * @returns {Promise<any>}
     */
    initSources(): Promise<any>;
    /**
     * Set the currentSource by passing the sourceKey or configIndex
     *
     * @param {string|number} keyOrConfig
     * @returns {Promise<IDataSourceState>}
     */
    setCurrentSource(keyOrConfig: string | number): Promise<IDataSource>;
    /**
     * Process to login and set the default source state and return the REST client state.
     *
     * @param {ILoginUser} data
     * @returns {Promise<IClientState>}
     */
    init(data: Query.ILoginUser): Promise<IClientState>;
    /**
     * Get the status of the Linkurious API.
     *
     * @returns {Promise<IAppStatus>}
     */
    getAppStatus(): Promise<IAppStatus>;
    /**
     * Get Linkurious' current version information
     *
     * @returns {Promise<IAppVersion>}
     */
    getAppVersion(): Promise<IAppVersion>;
    /**
     * Return the configuration of the application.
     *
     * @param {number} [sourceIndex]
     * @returns {Promise<IAppConfig>}
     */
    getAppConfig(sourceIndex?: number): Promise<IAppConfig>;
    /**
     * List nodeCategories, edgeTypes, nodeProperties and edgeProperties before the first indexation.
     *
     * @returns {Promise<ISchema>}
     */
    getSchema(): Promise<ISchema>;
    track(data: any): Promise<any>;
    /**
     * Store a source in clientState if condition is verified
     *
     * @param {IFullDataSource} source
     * @param {string} property
     * @param {string|number|boolean} matchValue
     * @returns {IDataSource}
     */
    private storeSource(source, property, matchValue);
}
