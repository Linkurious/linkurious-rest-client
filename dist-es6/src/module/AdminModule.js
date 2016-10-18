/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-05-27.
 *
 * File:
 * Description :
 */
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var utils_1 = require('../http/utils');
var Module_1 = require('./Module');
var AdminModule = (function (_super) {
    __extends(AdminModule, _super);
    function AdminModule(fetcher, logger, clientState) {
        _super.call(this, fetcher);
        this._logger = logger;
        this._clientState = clientState;
    }
    /**
     * Connect a disconnected data-source
     *
     * @param {IDataSourceConfig} data
     * @returns {Promise<boolean>}
     */
    AdminModule.prototype.connectDataSource = function (data) {
        return this.fetch({
            url: '/admin/source/{dataSourceIndex}/connect',
            method: 'POST',
            dataSource: data
        }).then(function () { return true; });
    };
    /**
     * Create a new data-source configuration (contains a graph database configuration and an index configuration).
     *
     * @param {ICreateDataSource} data
     * @returns {Promise<boolean>}
     */
    AdminModule.prototype.createDataSourceConfig = function (data) {
        return this.fetch({
            url: '/admin/sources/config',
            method: 'POST',
            body: data
        }).then(function () { return true; });
    };
    /**
     * Delete a data-source configuration that has currently no connected data-source.
     *
     * @param {IDataSourceConfig} [data]
     * @returns {Promise<boolean>}
     */
    AdminModule.prototype.deleteDataSourceConfig = function (data) {
        return this.fetch({
            url: '/admin/sources/config/{dataSourceIndex}',
            method: 'DELETE',
            dataSource: data
        }).then(function () { return true; });
    };
    /**
     * Delete all data of data-source (visualizations, access-rights, widgets, full-text indexes).
     * Optionally merge visualizations and widgets into another data-source instead of deleting them.
     * Warning: when merging into another data-source, visualizations may break if node and edge IDs
     * are not the same in to target data-source.
     *
     * @param {IDeleteDataSource} data
     * @returns {Promise<IDeletedDataSource>}
     */
    AdminModule.prototype.deleteFullDataSource = function (data) {
        var mergeOptions = (data.mergeInto) ? { mergeInto: data.mergeInto } : undefined;
        return this.fetch({
            url: '/admin/sources/data/{dataSourceKey}',
            method: 'DELETE',
            body: utils_1.Utils.fixSnakeCase(mergeOptions),
            dataSource: this.setDataSourceKey(data.dataSourceKey)
        });
    };
    /**
     * Get information for all data-source, including data-sources that do not exist online.
     *
     * @returns {Promise<Array<IFullDataSource>>}
     */
    AdminModule.prototype.getDataSourcesList = function () {
        return this.fetch({
            url: '/admin/sources',
            method: 'GET'
        });
    };
    /**
     * Get the list of edge-properties hidden for the given data-source.
     *
     * @param {IDataSourceRelative} [data]
     * @returns {Promise<Array<string>>}
     */
    AdminModule.prototype.getHiddenEdgeProperties = function (data) {
        return this.fetch({
            url: '/admin/source/{dataSourceKey}/hidden/edgeProperties',
            method: 'GET',
            dataSource: data
        });
    };
    /**
     * Get the list of node-properties hidden for the given data-source.
     *
     * @param {IDataSourceRelative} [data]
     * @returns {Promise<Array<string>>}
     */
    AdminModule.prototype.getHiddenNodeProperties = function (data) {
        return this.fetch({
            url: '/admin/source/{dataSourceKey}/hidden/nodeProperties',
            method: 'GET',
            dataSource: data
        });
    };
    /**
     * Get the list of edge-properties that re not indexed for the given data-source.
     *
     * @param {IDataSourceRelative} [data]
     * @returns {Promise<Array<string>>}
     */
    AdminModule.prototype.getNonIndexedEdgeProperties = function (data) {
        return this.fetch({
            url: '/admin/source/{dataSourceKey}/noIndex/edgeProperties',
            method: 'GET',
            dataSource: data
        });
    };
    /**
     * Get the list of node-properties that are not indexed for the given data-source.
     *
     * @param {IDataSourceRelative} [data]
     * @returns {Promise<Array<string>>}
     */
    AdminModule.prototype.getNonIndexedNodeProperties = function (data) {
        return this.fetch({
            url: '/admin/source/{dataSourceKey}/noIndex/nodeProperties',
            method: 'GET',
            dataSource: data
        });
    };
    /**
     * Set the list of edge-properties that are hidden for the given data-source.
     *
     * @param {ISetDataSourceProperties} data
     * @returns {Promise<boolean>}
     */
    AdminModule.prototype.setHiddenEdgeProperties = function (data) {
        return this.fetch({
            url: '/admin/source/{dataSourceKey}/hidden/edgeProperties',
            method: 'PUT',
            body: data,
            dataSource: this.setDataSourceKey(data.dataSourceKey)
        });
    };
    /**
     * Set the list of node-properties that are hidden for the given data-source.
     *
     * @param {ISetDataSourceProperties} data
     * @returns {Promise<boolean>}
     */
    AdminModule.prototype.setHiddenNodeProperties = function (data) {
        return this.fetch({
            url: '/admin/source/{dataSourceKey}/hidden/nodeProperties',
            method: 'PUT',
            body: data,
            dataSource: this.setDataSourceKey(data.dataSourceKey)
        });
    };
    /**
     * Set the list of edge-properties that are not indexed for the given data-source.
     *
     * @param {ISetDataSourceProperties} data
     * @returns {Promise<boolean>}
     */
    AdminModule.prototype.setNotIndexedEdgeProperties = function (data) {
        return this.fetch({
            url: '/admin/source/{dataSourceKey}/noIndex/edgeProperties',
            method: 'PUT',
            body: data,
            dataSource: this.setDataSourceKey(data.dataSourceKey)
        });
    };
    /**
     * Set the list of node-properties that are not indexed for the given data-source.
     *
     * @param {ISetDataSourceProperties} data
     * @returns {Promise<boolean>}
     */
    AdminModule.prototype.setNotIndexedNodeProperties = function (data) {
        return this.fetch({
            url: '/admin/source/{dataSourceKey}/noIndex/nodeProperties',
            method: 'PUT',
            body: data,
            dataSource: this.setDataSourceKey(data.dataSourceKey)
        });
    };
    /**
     * Add a new user to the application.
     *
     * @param {ICreateUser} data
     * @returns {Promise<IFullUser>}
     */
    AdminModule.prototype.createUser = function (data) {
        return this.fetch({
            url: '/admin/users',
            method: 'POST',
            body: data
        });
    };
    /**
     * Deletes a user in the application.
     *
     * @param {number} userId
     * @returns {Promise<boolean>}
     */
    AdminModule.prototype.deleteUser = function (userId) {
        return this.fetch({
            url: '/admin/users/{id}',
            method: 'DELETE',
            body: { id: userId }
        }).then(function () { return true; });
    };
    /**
     * Adds a new group to the application.
     * @param {ICreateGroup} data
     * @returns {Promise<IGroup>}
     */
    AdminModule.prototype.createGroup = function (data) {
        var dataToSend = {
            name: data.name
        };
        return this.fetch({
            url: '/admin/{dataSourceKey}/groups',
            method: 'POST',
            body: dataToSend,
            dataSource: this.setDataSourceKey(data.dataSourceKey)
        });
    };
    /**
     * Deletes a group in the application.
     *
     * @param {number} groupId
     * @returns {Promise<boolean>}
     */
    AdminModule.prototype.deleteGroup = function (groupId) {
        return this.fetch({
            url: '/admin/groups/{id}',
            method: 'DELETE',
            body: { id: groupId }
        }).then(function () { return true; });
    };
    /**
     * List a group already defined in the database.
     *
     * @param {number} data
     * @returns {Promise<IGroup>}
     */
    AdminModule.prototype.getGroup = function (data) {
        return this.fetch({
            url: '/admin/{dataSourceKey}/groups/{id}',
            method: 'GET',
            query: { id: data.id },
            dataSource: this.setDataSourceKey(data.dataSourceKey)
        });
    };
    /**
     * List all the groups already defined in the database and based on the dataSource.
     *
     * @param {IDataSourceRelative} data
     * @returns {Promise<Array<IGroup>>}
     */
    AdminModule.prototype.getGroups = function (data) {
        return this.fetch({
            url: '/admin/{dataSourceKey}/groups',
            method: 'GET',
            dataSource: data
        });
    };
    /**
     * List all the groups available.
     *
     * @returns {Promise<ISimpleGroup>}
     */
    AdminModule.prototype.getSimpleGroups = function () {
        return this.fetch({
            url: '/admin/groups',
            method: 'GET'
        });
    };
    /**
     * Get possible targetType, type and action names.
     *
     * @param {IDataSourceRelative} data
     * @returns {Promise<IGroupRights>}
     */
    AdminModule.prototype.getGroupsRights = function (data) {
        return this.fetch({
            url: '/admin/{dataSourceKey}/groups/rights_info',
            method: 'GET',
            dataSource: data
        });
    };
    /**
     * Bulk-set rights for a whole targetType on one or many groups.
     *
     * @param {IUpdateBatchGroupRights} data
     * @returns {Promise<boolean>}
     */
    AdminModule.prototype.updateBatchGroupsRights = function (data) {
        return this.fetch({
            url: '/admin/{dataSourceKey}/groups/group_rights',
            method: 'PUT',
            body: data,
            dataSource: this.setDataSourceKey(data.dataSourceKey)
        }).then(function () { return true; });
    };
    /**
     * Overrides a given right with the one specified.
     *
     * @param {IUpdateGroupRights} data
     * @returns {Promise<IAccessRight>}
     */
    AdminModule.prototype.updateGroupRights = function (data) {
        return this.fetch({
            url: '/admin/{dataSourceKey}/groups/{id}/group_rights',
            method: 'PUT',
            body: data,
            dataSource: this.setDataSourceKey(data.dataSourceKey)
        });
    };
    /**
     * Patches users in the application.
     * Beware, if all the groups for a given user are deleted, the user is added to the default group.
     *
     * @param {IUpdateBatchUser} data
     * @returns {Promise<boolean>}
     */
    AdminModule.prototype.updateBatchUser = function (data) {
        return this.fetch({
            url: '/admin/users',
            method: 'PATCH',
            body: data
        }).then(function () { return true; });
    };
    /**
     * Patches a user in the application
     *
     * @param {IUpdateUser} data
     * @returns {Promise<IFullUser>}
     */
    AdminModule.prototype.updateUser = function (data) {
        return this.fetch({
            url: '/admin/users/{id}',
            method: 'PATCH',
            body: data
        });
    };
    /**
     * Sets the configuration of the application
     *
     * @param {IUpdateAppConfig} data
     * @returns {Promise<string>}
     */
    AdminModule.prototype.updateConfig = function (data) {
        var query = {
            reset: data.reset,
            sourceIndex: data.dataSourceIndex
        };
        var body = {
            path: data.path,
            configuration: data.configuration
        };
        return this.fetch({
            url: '/config',
            method: 'POST',
            body: body,
            query: query
        });
    };
    /**
     * Request to reindex the graph database. One may want to do it after editing the index configuration.
     *
     * @returns {Promise<boolean>}
     */
    AdminModule.prototype.startIndexation = function () {
        return this.fetch({
            url: '/{dataSourceKey}/search/reindex',
            method: 'GET'
        }).then(function () { return true; });
    };
    /**
     * Get the status of the Search API and return the indexing progress.
     *
     * @returns {Promise<IIndexationStatus>}
     */
    AdminModule.prototype.getIndexationStatus = function () {
        return this.fetch({
            url: '/{dataSourceKey}/search/status',
            method: 'GET'
        });
    };
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
    AdminModule.prototype.processIndexation = function (timeout, callback) {
        var _this = this;
        var minTimeout = 200;
        var maxTimeout = 3000;
        if (this._logger.level === 'debug') {
            minTimeout = 50;
        }
        if (timeout < minTimeout) {
            timeout = 200;
        }
        if (timeout > maxTimeout) {
            timeout = 3000;
        }
        return this.startIndexation()
            .then(function () { return _this.listenIndexation(timeout, callback); })
            .then(function () { return true; });
    };
    /**
     * Create and return new alert
     * @param {ICreateAlert} data
     * @returns {Promise<IFullAdminAlert>}
     */
    AdminModule.prototype.createAlert = function (data) {
        return this.fetch({
            url: '/admin/{dataSourceKey}/alerts',
            method: 'POST',
            body: data,
            dataSource: this.setDataSourceKey(data.dataSourceKey)
        });
    };
    /**
     * update existing alert
     * @param {ICreateAlert} data
     * @returns {Promise<IFullAdminAlert>}
     */
    AdminModule.prototype.updateAlert = function (data) {
        return this.fetch({
            url: '/admin/{dataSourceKey}/alerts/{id}',
            method: 'PATCH',
            body: data
        });
    };
    /**
     * delete existing alert
     * @param {IAlert} data
     * @returns {Promise<boolean>}
     */
    AdminModule.prototype.deleteAlert = function (data) {
        return this.fetch({
            url: '/admin/{dataSourceKey}/alerts/{id}',
            method: 'DELETE',
            body: data
        }).then(function () { return true; });
    };
    /**
     * get list of all alerts
     * @param {IDataSourceRelative} data
     * @returns {Promise<IFullAdminAlert>}
     */
    AdminModule.prototype.getAlerts = function (data) {
        return this.fetch({
            url: '/admin/{dataSourceKey}/alerts',
            method: 'GET',
            dataSource: this.setDataSourceKey(data.dataSourceKey)
        });
    };
    /**
     * get an alert
     * @param {IAlert} data
     * @returns {Promise<IFullAdminAlert>}
     */
    AdminModule.prototype.getAlert = function (data) {
        return this.fetch({
            url: '/admin/{dataSourceKey}/alerts/{id}',
            method: 'GET',
            body: data
        });
    };
    /**
     * reset all default styles for a dataSource
     * @param {IDataSourceRelative} data
     * @returns {Promise<boolean>}
     */
    AdminModule.prototype.resetStyles = function (data) {
        return this.fetch({
            url: '/admin/source/{dataSourceKey}/resetDefaultStyles',
            method: 'POST',
            dataSource: this.setDataSourceKey(data.dataSourceKey)
        }).then(function () { return true; });
    };
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
    AdminModule.prototype.listenIndexation = function (timeout, callback) {
        var _this = this;
        return this.getIndexationStatus().then(function (res) {
            if (res.indexing !== 'done') {
                if (callback) {
                    callback(res);
                }
                return new Promise(function (resolve) {
                    return setTimeout(resolve, timeout);
                }).then(function () { return _this.listenIndexation(timeout, callback); });
            }
            else {
                return true;
            }
        });
    };
    return AdminModule;
}(Module_1.Module));
exports.AdminModule = AdminModule;
//# sourceMappingURL=AdminModule.js.map