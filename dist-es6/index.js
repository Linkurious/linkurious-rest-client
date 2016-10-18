/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-04-25.
 *
 * File:
 * Description :
 */
"use strict";
const Logger_1 = require('./src/log/Logger');
const fetcher_1 = require('./src/http/fetcher');
const AdminModule_1 = require('./src/module/AdminModule');
const MyModule_1 = require('./src/module/MyModule');
const GraphModule_1 = require('./src/module/GraphModule');
const EdgeModule_1 = require('./src/module/EdgeModule');
const NodeModule_1 = require('./src/module/NodeModule');
const SearchModule_1 = require('./src/module/SearchModule');
const VisualizationModule_1 = require('./src/module/VisualizationModule');
class Linkurious {
    /**
     *
     * @param {string} host           - Host URL of the linkurious server
     * @param {string} logLevel       - Level of log wanted
     * @param {object} [loggerDriver] - logger object
     */
    constructor(host, logLevel, loggerDriver) {
        this._clientState = {};
        this._logger = new Logger_1.Logger(logLevel, loggerDriver);
        this._fetcher = new fetcher_1.Fetcher(this._logger, this._clientState, host);
        this._admin = new AdminModule_1.AdminModule(this._fetcher, this._logger, this._clientState);
        this._my = new MyModule_1.MyModule(this._fetcher);
        this._graph = new GraphModule_1.GraphModule(this._fetcher);
        this._edge = new EdgeModule_1.EdgeModule(this._fetcher);
        this._node = new NodeModule_1.NodeModule(this._fetcher);
        this._search = new SearchModule_1.SearchModule(this._fetcher);
        this._visualization = new VisualizationModule_1.VisualizationModule(this._fetcher);
    }
    get state() {
        return this._clientState;
    }
    /**
     * @returns {AdminModule}
     */
    get admin() {
        return this._admin;
    }
    /**
     * @returns {MyModule}
     */
    get my() {
        return this._my;
    }
    /**
     * @returns {GraphModule}
     */
    get graph() {
        return this._graph;
    }
    /**
     * @returns {EdgeModule}
     */
    get edge() {
        return this._edge;
    }
    /**
     * @returns {NodeModule}
     */
    get node() {
        return this._node;
    }
    /**
     * @returns {SearchModule}
     */
    get search() {
        return this._search;
    }
    /**
     * @returns {VisualizationModule}
     */
    get visualization() {
        return this._visualization;
    }
    /**
     * Process to login of the corresponding user and return it.
     *
     * @param {ILoginUser} data
     * @returns {Promise<boolean>}
     */
    login(data) {
        let config = {
            url: '/auth/login',
            method: 'POST',
            body: data
        };
        if (this._clientState.user) {
            return this.logout().then(() => {
                return this._fetcher.fetch(config);
            }).then((res) => {
                this._clientState.user = res.user;
                return true;
            });
        }
        else {
            return this._fetcher.fetch(config).then((res) => {
                this._clientState.user = res.user;
                return true;
            });
        }
    }
    /**
     * Clear the user session.
     *
     * @returns {Promise<string>}
     */
    logout() {
        return this._fetcher.fetch({
            url: '/auth/logout',
            method: 'GET'
        })
            .then(() => {
            this._clientState.user = undefined;
            return 'user disconnected';
        });
    }
    /**
     * Update the current user connected
     *
     * @param {IUpdateUser} data
     * @returns {Promise<IFullUser>}
     */
    updateCurrentUser(data) {
        return this._fetcher.fetch({
            url: '/auth/me',
            method: 'PATCH',
            body: data
        }).then((res) => {
            this._clientState.user = Object.assign(this._clientState.user, res);
            return this._clientState.user;
        });
    }
    /**
     * Get the status of the all data-sources.
     *
     * @returns {Promise<IDataSourceState>}
     */
    getSourceList() {
        return this._fetcher.fetch({
            url: '/dataSources',
            method: 'GET'
        }).then((res) => res.sources);
    }
    /**
     * Set the currentSource to the first source connected
     *
     * @returns {Promise<IDataSource>}
     */
    initCurrentSource() {
        return this.getSourceList().then((sourceStates) => {
            for (let sourceState of sourceStates) {
                if (this.storeSource(sourceState, 'connected', true)) {
                    return this._clientState.currentSource;
                }
            }
            return undefined;
        });
    }
    /**
     * Set the currentSource by passing the sourceKey or configIndex
     *
     * @param {string|number} keyOrConfig
     * @returns {Promise<IDataSourceState>}
     */
    setCurrentSource(keyOrConfig) {
        return this.getSourceList().then((sourceStates) => {
            for (let sourceState of sourceStates) {
                let sourceComparator;
                if (typeof keyOrConfig === 'string') {
                    sourceComparator = 'key';
                }
                else {
                    sourceComparator = 'configIndex';
                }
                if (this.storeSource(sourceState, sourceComparator, keyOrConfig)) {
                    return this._clientState.currentSource;
                }
            }
            return undefined;
        });
    }
    /**
     * Process to login and set the default source state and return the REST client state.
     *
     * @param {ILoginUser} data
     * @returns {Promise<IClientState>}
     */
    startClient(data) {
        return this.login(data).then(() => {
            return this.initCurrentSource();
        }).then(() => {
            return this._clientState;
        });
    }
    /**
     * Get the status of the Linkurious API.
     *
     * @returns {Promise<IAppStatus>}
     */
    getAppStatus() {
        return this._fetcher.fetch({
            url: '/status',
            method: 'GET'
        }).then((res) => {
            return res.status;
        });
    }
    /**
     * Get Linkurious' current version information
     *
     * @returns {Promise<IAppVersion>}
     */
    getAppVersion() {
        return this._fetcher.fetch({
            method: 'GET',
            url: '/version'
        });
    }
    /**
     * Return the configuration of the application.
     *
     * @param {number} [sourceIndex]
     * @returns {Promise<IAppConfig>}
     */
    getAppConfig(sourceIndex) {
        return this._fetcher.fetch({
            method: 'GET',
            query: { sourceIndex: sourceIndex },
            url: '/config'
        });
    }
    /**
     * List nodeCategories, edgeTypes, nodeProperties and edgeProperties before the first indexation.
     *
     * @returns {Promise<ISchema>}
     */
    getSchema() {
        return this._fetcher.fetch({
            method: 'GET',
            url: '/{dataSourceKey}/graph/schema/simple'
        });
    }
    /**
     * Store a source in clientState if condition is verified
     *
     * @param {IFullDataSource} source
     * @param {string} property
     * @param {string|number|boolean} matchValue
     * @returns {IDataSource}
     */
    storeSource(source, property, matchValue) {
        if (source[property] === matchValue) {
            this._clientState.currentSource = {
                name: source.name,
                key: source.key,
                configIndex: source.configIndex
            };
            return this._clientState.currentSource;
        }
        else {
            return undefined;
        }
    }
}
module.exports = Linkurious;
//# sourceMappingURL=index.js.map