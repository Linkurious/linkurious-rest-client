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
var Logger_1 = require('./src/log/Logger');
var FetcherFactory_1 = require('./src/http/FetcherFactory');
var AdminModule_1 = require('./src/module/AdminModule');
var MyModule_1 = require('./src/module/MyModule');
var GraphModule_1 = require('./src/module/GraphModule');
var EdgeModule_1 = require('./src/module/EdgeModule');
var NodeModule_1 = require('./src/module/NodeModule');
var SearchModule_1 = require('./src/module/SearchModule');
var VisualizationModule_1 = require('./src/module/VisualizationModule');
var AlertModule_1 = require('./src/module/AlertModule');
var Linkurious = (function () {
    /**
     *
     * @param {string} host           - Host URL of the linkurious server
     * @param {string} logLevel       - Level of log wanted
     * @param {object} [loggerDriver] - logger object
     * @param {FetcherFactory} [fetcherFactory] - fetcher factory
     */
    function Linkurious(host, logLevel, loggerDriver, fetcherFactory) {
        this._clientState = {};
        this._logger = new Logger_1.Logger(logLevel, loggerDriver);
        if (!fetcherFactory) {
            fetcherFactory = new FetcherFactory_1.FetcherFactory();
        }
        this._fetcher = fetcherFactory.create(this._logger, this._clientState, host);
        this._admin = new AdminModule_1.AdminModule(this._fetcher, this._logger, this._clientState);
        this._my = new MyModule_1.MyModule(this._fetcher);
        this._graph = new GraphModule_1.GraphModule(this._fetcher);
        this._edge = new EdgeModule_1.EdgeModule(this._fetcher);
        this._node = new NodeModule_1.NodeModule(this._fetcher);
        this._search = new SearchModule_1.SearchModule(this._fetcher);
        this._visualization = new VisualizationModule_1.VisualizationModule(this._fetcher);
        this._alert = new AlertModule_1.AlertModule(this._fetcher);
    }
    Object.defineProperty(Linkurious.prototype, "state", {
        get: function () {
            return this._clientState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Linkurious.prototype, "fetcher", {
        /**
         * @returns {Fetcher}
         */
        get: function () {
            return this._fetcher;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Linkurious.prototype, "admin", {
        /**
         * @returns {AdminModule}
         */
        get: function () {
            return this._admin;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Linkurious.prototype, "my", {
        /**
         * @returns {MyModule}
         */
        get: function () {
            return this._my;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Linkurious.prototype, "graph", {
        /**
         * @returns {GraphModule}
         */
        get: function () {
            return this._graph;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Linkurious.prototype, "edge", {
        /**
         * @returns {EdgeModule}
         */
        get: function () {
            return this._edge;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Linkurious.prototype, "node", {
        /**
         * @returns {NodeModule}
         */
        get: function () {
            return this._node;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Linkurious.prototype, "search", {
        /**
         * @returns {SearchModule}
         */
        get: function () {
            return this._search;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Linkurious.prototype, "visualization", {
        /**
         * @returns {VisualizationModule}
         */
        get: function () {
            return this._visualization;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Linkurious.prototype, "alerts", {
        /**
         * @returns {AlertModule}
         */
        get: function () {
            return this._alert;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Process to login of the corresponding user and return it.
     *
     * @param {ILoginUser} data
     * @returns {Promise<boolean>}
     */
    Linkurious.prototype.login = function (data) {
        var _this = this;
        var config = {
            url: '/auth/login',
            method: 'POST',
            body: data
        };
        if (this._clientState.user) {
            return this.logout().then(function () {
                return _this._fetcher.fetch(config);
            }).then(function (res) {
                _this._clientState.user = res.user;
                return _this._clientState.user;
            });
        }
        else {
            return this._fetcher.fetch(config).then(function (res) {
                _this._clientState.user = res.user;
                return _this._clientState.user;
            });
        }
    };
    Linkurious.prototype.oAuthAzure = function () {
        return this._fetcher.fetch({
            url: '/auth/azuread/login',
            method: 'GET'
        }).then(function () { return true; });
    };
    /**
     * Clear the user session.
     *
     * @returns {Promise<string>}
     */
    Linkurious.prototype.logout = function () {
        var _this = this;
        return this._fetcher.fetch({
            url: '/auth/logout',
            method: 'GET'
        })
            .then(function () {
            _this._clientState.user = undefined;
            return 'user disconnected';
        });
    };
    /**
     * Update the current user connected
     *
     * @param {IUpdateUser} data
     * @returns {Promise<IFullUser>}
     */
    Linkurious.prototype.updateCurrentUser = function (data) {
        var _this = this;
        return this._fetcher.fetch({
            url: '/auth/me',
            method: 'PATCH',
            body: data
        }).then(function (res) {
            _this._clientState.user = Object.assign(_this._clientState.user, res);
            return _this._clientState.user;
        });
    };
    /**
     * Get the status of the all data-sources.
     *
     * @returns {Promise<IDataSourceState>}
     */
    Linkurious.prototype.getSourceList = function () {
        return this._fetcher.fetch({
            url: '/dataSources',
            method: 'GET'
        }).then(function (res) { return res.sources; });
    };
    /**
     * Set the currentSource to the first source connected
     *
     * @returns {Promise<any>}
     */
    Linkurious.prototype.initSources = function () {
        var _this = this;
        return this.getSourceList().then(function (sourceStates) {
            for (var _i = 0, sourceStates_1 = sourceStates; _i < sourceStates_1.length; _i++) {
                var sourceState = sourceStates_1[_i];
                if (_this.storeSource(sourceState, 'connected', true)) {
                    return {
                        sources: sourceStates,
                        currentSource: _this._clientState.currentSource
                    };
                }
            }
        });
    };
    /**
     * Set the currentSource by passing the sourceKey or configIndex
     *
     * @param {string|number} keyOrConfig
     * @returns {Promise<IDataSourceState>}
     */
    Linkurious.prototype.setCurrentSource = function (keyOrConfig) {
        var _this = this;
        return this.getSourceList().then(function (sourceStates) {
            for (var _i = 0, sourceStates_2 = sourceStates; _i < sourceStates_2.length; _i++) {
                var sourceState = sourceStates_2[_i];
                var sourceComparator = void 0;
                if (typeof keyOrConfig === 'string') {
                    sourceComparator = 'key';
                }
                else {
                    sourceComparator = 'configIndex';
                }
                if (_this.storeSource(sourceState, sourceComparator, keyOrConfig)) {
                    return _this._clientState.currentSource;
                }
            }
            return undefined;
        });
    };
    /**
     * Process to login and set the default source state and return the REST client state.
     *
     * @param {ILoginUser} data
     * @returns {Promise<IClientState>}
     */
    Linkurious.prototype.init = function (data) {
        var _this = this;
        return this.login(data).then(function () {
            return _this.initSources();
        }).then(function () {
            return _this._clientState;
        });
    };
    /**
     * Get the status of the Linkurious API.
     *
     * @returns {Promise<IAppStatus>}
     */
    Linkurious.prototype.getAppStatus = function () {
        return this._fetcher.fetch({
            url: '/status',
            method: 'GET'
        }).then(function (res) {
            return res.status;
        });
    };
    /**
     * Get Linkurious' current version information
     *
     * @returns {Promise<IAppVersion>}
     */
    Linkurious.prototype.getAppVersion = function () {
        return this._fetcher.fetch({
            method: 'GET',
            url: '/version'
        });
    };
    /**
     * Return the configuration of the application.
     *
     * @param {number} [sourceIndex]
     * @returns {Promise<IAppConfig>}
     */
    Linkurious.prototype.getAppConfig = function (sourceIndex) {
        return this._fetcher.fetch({
            method: 'GET',
            query: { sourceIndex: sourceIndex },
            url: '/config'
        }).then(function (response) { return response.config; });
    };
    /**
     * List nodeCategories, edgeTypes, nodeProperties and edgeProperties before the first indexation.
     *
     * @returns {Promise<ISchema>}
     */
    Linkurious.prototype.getSchema = function () {
        return this._fetcher.fetch({
            method: 'GET',
            url: '/{dataSourceKey}/graph/schema/simple'
        });
    };
    Linkurious.prototype.track = function (data) {
        return this._fetcher.fetch({
            method: 'POST',
            url: '/track',
            body: data
        });
    };
    /**
     * Store a source in clientState if condition is verified
     *
     * @param {IFullDataSource} source
     * @param {string} property
     * @param {string|number|boolean} matchValue
     * @returns {IDataSource}
     */
    Linkurious.prototype.storeSource = function (source, property, matchValue) {
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
    };
    return Linkurious;
}());
exports.Linkurious = Linkurious;
//# sourceMappingURL=index.js.map