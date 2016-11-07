/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-05-30.
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
var VisualizationModule = (function (_super) {
    __extends(VisualizationModule, _super);
    function VisualizationModule(fetcher) {
        _super.call(this, fetcher);
    }
    /**
     * Get the number of visualizations for the current user in this data-source.
     *
     * @returns {Promise<number>}
     */
    VisualizationModule.prototype.count = function () {
        return this.fetch({
            url: '/{dataSourceKey}/visualizations/count',
            method: 'GET'
        }).then(function (r) { return r.count; });
    };
    /**
     * Create a widget for a visualization.
     *
     * @param {ICreateWidget} data
     * @returns {Promise<string>}
     */
    VisualizationModule.prototype.createWidget = function (data) {
        return this.fetch({
            url: '/widget',
            method: 'POST',
            body: data
        });
    };
    /**
     * Create a folder for visualizations
     *
     * @param {ICreateFolder} data
     * @returns {Promise<IFolder>}
     */
    VisualizationModule.prototype.createFolder = function (data) {
        return this.fetch({
            url: '/{dataSourceKey}/visualizations/folder',
            method: 'POST',
            body: data
        }).then(function (res) { return res.folder; });
    };
    /**
     * Create a new visualization.
     *
     * @param {ICreateVisualization} data
     * @returns {Promise<IVisualization>}
     */
    VisualizationModule.prototype.create = function (data) {
        return this.fetch({
            url: '/{dataSourceKey}/visualizations',
            method: 'POST',
            body: data
        }).then(function (res) { return res.visualization; });
    };
    /**
     * Delete a widget for a visualization.
     *
     * @param {string} widgetKey
     * @returns {Promise<boolean>}
     */
    VisualizationModule.prototype.deleteWidget = function (widgetKey) {
        return this.fetch({
            url: '/widget/' + widgetKey,
            method: 'DELETE'
        }).then(function () { return true; });
    };
    /**
     * Remove the specified folder and its children (visualizations and sub-folders)
     *
     * @param {number} folderId
     * @returns {Promise<boolean>}
     */
    VisualizationModule.prototype.deleteFolder = function (folderId) {
        return this.fetch({
            url: '/{dataSourceKey}/visualizations/folder/' + folderId,
            method: 'DELETE'
        })
            .then(function () { return true; });
    };
    /**
     * Duplicates a visualization.
     *
     * @param {number} vizId
     * @returns {Promise<IVisualization>}
     */
    VisualizationModule.prototype.duplicate = function (vizId) {
        return this.fetch({
            url: '/{dataSourceKey}/visualizations/' + vizId + '/duplicate',
            method: 'POST'
        });
    };
    /**
     * Get a visualization widget's data by key
     *
     * @param {string} widgetKey
     * @returns {Promise<IWidget>}
     */
    VisualizationModule.prototype.getWidget = function (widgetKey) {
        return this.fetch({
            url: '/widget/' + widgetKey,
            method: 'GET'
        });
    };
    /**
     * Return the visualization sandbox of the current user for a given data-source
     *
     * @param {IGetSandbox} params
     * @returns {Promise<IVisualization>}
     */
    VisualizationModule.prototype.getSandbox = function (params) {
        return this.fetch({
            url: '/{dataSourceKey}/sandbox',
            method: 'GET',
            query: params
        }).then(function (res) { return res.visualization; });
    };
    /**
     * Return one visualizations selected by ID.
     *
     * @param {number} vizId
     * @returns {Promise<IVisualization>}
     */
    VisualizationModule.prototype.getOne = function (vizId) {
        return this.fetch({
            url: '/{dataSourceKey}/visualizations/' + vizId,
            method: 'GET'
        }).then(function (res) { return res.visualization; });
    };
    /**
     * Return visualizations ordered with folders hierarchy.
     *
     * @returns {Promise<ITreeChildren>}
     */
    VisualizationModule.prototype.getTree = function () {
        return this.fetch({
            url: '/{dataSourceKey}/visualizations/tree',
            method: 'GET'
        }).then(function (res) { return res.tree; });
    };
    /**
     * Remove visualization selected by id.
     *
     * @param {number} vizId
     * @returns {Promise<boolean>}
     */
    VisualizationModule.prototype.deleteOne = function (vizId) {
        return this.fetch({
            url: '/{dataSourceKey}/visualizations/' + vizId,
            method: 'DELETE'
        }).then(function () { return true; });
    };
    /**
     * Get all share rights on a visualization
     * @param {number} vizId
     * @returns {Promise<ISharers>}
     */
    VisualizationModule.prototype.getShares = function (vizId) {
        return this.fetch({
            url: '/{dataSourceKey}/visualizations/' + vizId + '/shares',
            method: 'GET'
        });
    };
    /**
     * Set the share right of a user on a visualization
     *
     * @param {ISetShareRights} data
     * @returns {Promise<IShare>}
     */
    VisualizationModule.prototype.share = function (data) {
        var url = '/{dataSourceKey}/visualizations/' + data.vizId + '/share/' + data.userId;
        delete data.vizId;
        delete data.userId;
        return this.fetch({
            url: url,
            method: 'PUT',
            body: {
                right: data.right
            }
        });
    };
    /**
     * Remove a share right of a user on a visualization
     *
     * @param {IUnshareVisualization} data
     * @returns {Promise<boolean>}
     */
    VisualizationModule.prototype.unshare = function (data) {
        return this.fetch({
            url: '/{dataSourceKey}/visualizations/' + data.id + '/shared/' + data.userId,
            method: 'DELETE'
        }).then(function () { return true; });
    };
    /**
     * Update a property of a folder
     *
     * @param {IUpdateFolder} data
     * @returns {Promise<boolean>}
     */
    VisualizationModule.prototype.updateFolder = function (data) {
        return this.fetch({
            url: '/{dataSourceKey}/visualizations/folder/{id}',
            method: 'PATCH',
            body: data
        }).then(function (response) { return response.folder; });
    };
    /**
     * Update the sandbox of the current user for a given data-source.
     *
     * @param {IUpdateSandbox} data
     * @returns {Promise<boolean>}
     */
    VisualizationModule.prototype.updateSandbox = function (data) {
        return this.fetch({
            url: '/{dataSourceKey}/sandbox',
            method: 'PATCH',
            body: data
        }).then(function () { return true; });
    };
    /**
     * Update visualization selected by id.
     *
     * @param {IUpdateVisualization} data
     * @returns {Promise<boolean>}
     */
    VisualizationModule.prototype.update = function (data) {
        return this.fetch({
            url: '/{dataSourceKey}/visualizations/{id}',
            method: 'PATCH',
            body: { id: data.id, visualization: data.visualization },
            query: { forceLock: data.forceLock }
        }).then(function () { return true; });
    };
    return VisualizationModule;
}(Module_1.Module));
exports.VisualizationModule = VisualizationModule;
//# sourceMappingURL=VisualizationModule.js.map