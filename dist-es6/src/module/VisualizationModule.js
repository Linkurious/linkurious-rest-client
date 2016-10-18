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
const Module_1 = require('./Module');
class VisualizationModule extends Module_1.Module {
    constructor(fetcher) {
        super(fetcher);
    }
    /**
     * Get the number of visualizations for the current user in this data-source.
     *
     * @returns {Promise<number>}
     */
    count() {
        return this.fetch({
            url: '/{dataSourceKey}/visualizations/count',
            method: 'GET'
        }).then((r) => r.count);
    }
    /**
     * Create a widget for a visualization.
     *
     * @param {ICreateWidget} data
     * @returns {Promise<string>}
     */
    createWidget(data) {
        return this.fetch({
            url: '/widget',
            method: 'POST',
            body: data
        });
    }
    /**
     * Create a folder for visualizations
     *
     * @param {ICreateFolder} data
     * @returns {Promise<IFolder>}
     */
    createFolder(data) {
        return this.fetch({
            url: '/{dataSourceKey}/visualizations/folder',
            method: 'POST',
            body: data
        }).then((res) => res.folder);
    }
    /**
     * Create a new visualization.
     *
     * @param {ICreateVisualization} data
     * @returns {Promise<IVisualization>}
     */
    create(data) {
        return this.fetch({
            url: '/{dataSourceKey}/visualizations',
            method: 'POST',
            body: data
        }).then((res) => res.visualization);
    }
    /**
     * Delete a widget for a visualization.
     *
     * @param {string} widgetKey
     * @returns {Promise<boolean>}
     */
    deleteWidget(widgetKey) {
        return this.fetch({
            url: '/widget/' + widgetKey,
            method: 'DELETE'
        }).then(() => true);
    }
    /**
     * Remove the specified folder and its children (visualizations and sub-folders)
     *
     * @param {number} folderId
     * @returns {Promise<boolean>}
     */
    deleteFolder(folderId) {
        return this.fetch({
            url: '/{dataSourceKey}/visualizations/folder/' + folderId,
            method: 'DELETE'
        })
            .then(() => true);
    }
    /**
     * Duplicates a visualization.
     *
     * @param {number} vizId
     * @returns {Promise<IVisualization>}
     */
    duplicate(vizId) {
        return this.fetch({
            url: '/{dataSourceKey}/visualizations/' + vizId + '/duplicate',
            method: 'POST'
        });
    }
    /**
     * Get a visualization widget's data by key
     *
     * @param {string} widgetKey
     * @returns {Promise<IWidget>}
     */
    getWidget(widgetKey) {
        return this.fetch({
            url: '/widget/' + widgetKey,
            method: 'GET'
        });
    }
    /**
     * Return the visualization sandbox of the current user for a given data-source
     *
     * @param {IGetSandbox} params
     * @returns {Promise<IVisualization>}
     */
    getSandbox(params) {
        return this.fetch({
            url: '/{dataSourceKey}/sandbox',
            method: 'GET',
            query: params
        }).then((res) => res.visualization);
    }
    /**
     * Return one visualizations selected by ID.
     *
     * @param {number} vizId
     * @returns {Promise<IVisualization>}
     */
    getOne(vizId) {
        return this.fetch({
            url: '/{dataSourceKey}/visualizations/' + vizId,
            method: 'GET'
        }).then((res) => res.visualization);
    }
    /**
     * Return visualizations ordered with folders hierarchy.
     *
     * @returns {Promise<ITreeChildren>}
     */
    getTree() {
        return this.fetch({
            url: '/{dataSourceKey}/visualizations/tree',
            method: 'GET'
        }).then((res) => res.tree);
    }
    /**
     * Remove visualization selected by id.
     *
     * @param {number} vizId
     * @returns {Promise<boolean>}
     */
    deleteOne(vizId) {
        return this.fetch({
            url: '/{dataSourceKey}/visualizations/' + vizId,
            method: 'DELETE'
        }).then(() => true);
    }
    /**
     * Get all share rights on a visualization
     * @param {number} vizId
     * @returns {Promise<ISharers>}
     */
    getShares(vizId) {
        return this.fetch({
            url: '/{dataSourceKey}/visualizations/' + vizId + '/shares',
            method: 'GET'
        });
    }
    /**
     * Set the share right of a user on a visualization
     *
     * @param {ISetShareRights} data
     * @returns {Promise<IShare>}
     */
    share(data) {
        let url = '/{dataSourceKey}/visualizations/' + data.vizId + '/share/' + data.userId;
        delete data.vizId;
        delete data.userId;
        return this.fetch({
            url: url,
            method: 'PUT',
            body: {
                right: data.right
            }
        });
    }
    /**
     * Remove a share right of a user on a visualization
     *
     * @param {IUnshareVisualization} data
     * @returns {Promise<boolean>}
     */
    unshare(data) {
        return this.fetch({
            url: '/{dataSourceKey}/visualizations/' + data.id + '/shared/' + data.userId,
            method: 'DELETE'
        }).then(() => true);
    }
    /**
     * Update a property of a folder
     *
     * @param {IUpdateFolder} data
     * @returns {Promise<boolean>}
     */
    updateFolder(data) {
        return this.fetch({
            url: '/{dataSourceKey}/visualizations/folder/{id}',
            method: 'PATCH',
            body: data
        }).then(() => true);
    }
    /**
     * Update the sandbox of the current user for a given data-source.
     *
     * @param {IUpdateSandbox} data
     * @returns {Promise<boolean>}
     */
    updateSandbox(data) {
        return this.fetch({
            url: '/{dataSourceKey}/sandbox',
            method: 'PATCH',
            body: data
        }).then(() => true);
    }
    /**
     * Update visualization selected by id.
     *
     * @param {IUpdateVisualization} data
     * @returns {Promise<boolean>}
     */
    update(data) {
        return this.fetch({
            url: '/{dataSourceKey}/visualizations/{id}',
            method: 'PATCH',
            body: { id: data.id, visualization: data.visualization },
            query: { forceLock: data.forceLock }
        }).then(() => true);
    }
}
exports.VisualizationModule = VisualizationModule;
//# sourceMappingURL=VisualizationModule.js.map