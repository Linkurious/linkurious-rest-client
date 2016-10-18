/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-10-03.
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
var Module_1 = require('./Module');
var AlertModule = (function (_super) {
    __extends(AlertModule, _super);
    /**
     *
     * @param {Fetcher} fetcher
     */
    function AlertModule(fetcher) {
        _super.call(this, fetcher);
    }
    /**
     * get list of alerts
     * @param {IDataSourceRelative} data
     * @returns {Promise<IAlert>}
     */
    AlertModule.prototype.getAlerts = function (data) {
        return this.fetch({
            url: '/{dataSourceKey}/alerts',
            method: 'GET',
            query: this.setDataSourceKey(data.dataSourceKey)
        });
    };
    /**
     * get an alert
     * @param {IAlert} data
     * @returns {Promise<IMatch>}
     */
    AlertModule.prototype.getAlert = function (data) {
        return this.fetch({
            url: '/{dataSourceKey}/alerts/{id}',
            method: 'GET',
            query: data
        });
    };
    /**
     * get matches for an alert
     * @param {IFilteredAlert} data
     * @returns {Promise<IMatchResults>}
     */
    AlertModule.prototype.getMatches = function (data) {
        return this.fetch({
            url: '/{dataSourceKey}/alerts/{id}/matches',
            method: 'GET',
            query: data
        });
    };
    /**
     * Do an action on a match
     * @param {IAddActionMatch} data
     * @returns {Promise<boolean>}
     */
    AlertModule.prototype.addActionToMatch = function (data) {
        var body = {
            dataSource: data.dataSourceKey,
            id: data.id,
            action: data.action
        };
        return this.fetch({
            url: "/{dataSourceKey}/alerts/{id}/matches/" + data.matchId + "/action",
            method: 'POST',
            body: body
        }).then(function () { return true; });
    };
    /**
     * get a match
     * @param {IMatch} data
     * @returns {Promise<IMatch>}
     */
    AlertModule.prototype.getMatch = function (data) {
        return this.fetch({
            url: "/{dataSourceKey}/alerts/{id}/matches/" + data.matchId,
            method: 'GET',
            body: data
        });
    };
    /**
     * get all actions for a match
     * @param {IMatch} data
     * @returns {Promise<IMatchAction>}
     */
    AlertModule.prototype.getMatchActions = function (data) {
        return this.fetch({
            url: "/{dataSourceKey}/alerts/{id}/matches/" + data.matchId + "/actions",
            method: 'GET',
            body: data
        });
    };
    return AlertModule;
}(Module_1.Module));
exports.AlertModule = AlertModule;
//# sourceMappingURL=AlertModule.js.map