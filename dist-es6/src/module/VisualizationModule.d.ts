import * as Query from '../Query';
import { IVisualization, IWidget, ITreeChildren, ISharers, IShare, IFolder } from '../interfaces';
import { Module } from './Module';
import { Fetcher } from '../http/fetcher';
import { IDuplicateVisualization } from '../Query';
export declare class VisualizationModule extends Module {
    constructor(fetcher: Fetcher);
    /**
     * get shared visualizations
     *
     * @returns {Promise<any>}
     */
    getShared(): Promise<Array<IVisualization>>;
    /**
     * Get the number of visualizations for the current user in this data-source.
     *
     * @returns {Promise<number>}
     */
    count(): Promise<number>;
    /**
     * Create a widget for a visualization.
     *
     * @param {ICreateWidget} data
     * @returns {Promise<string>}
     */
    createWidget(data: Query.ICreateWidget): Promise<string>;
    /**
     * Create a folder for visualizations
     *
     * @param {ICreateFolder} data
     * @returns {Promise<IFolder>}
     */
    createFolder(data: Query.ICreateFolder): Promise<IFolder>;
    /**
     * Create a new visualization.
     *
     * @param {ICreateVisualization} data
     * @returns {Promise<IVisualization>}
     */
    create(data: Query.ICreateVisualization): Promise<IVisualization>;
    /**
     * Delete a widget for a visualization.
     *
     * @param {string} widgetKey
     * @returns {Promise<boolean>}
     */
    deleteWidget(widgetKey: string): Promise<boolean>;
    /**
     * Remove the specified folder and its children (visualizations and sub-folders)
     *
     * @param {number} folderId
     * @returns {Promise<boolean>}
     */
    deleteFolder(folderId: number): Promise<boolean>;
    /**
     * Duplicates a visualization.
     *
     * @param {IDuplicateVisualization} data
     * @returns {Promise<IVisualization>}
     */
    duplicate(data: IDuplicateVisualization): Promise<IVisualization>;
    /**
     * Get a visualization widget's data by key
     *
     * @param {string} widgetKey
     * @returns {Promise<IWidget>}
     */
    getWidget(widgetKey: string): Promise<IWidget>;
    /**
     * Return the visualization sandbox of the current user for a given data-source
     *
     * @param {IGetSandbox} params
     * @returns {Promise<IVisualization>}
     */
    getSandbox(params: Query.IGetSandbox): Promise<IVisualization>;
    /**
     * Return one visualizations selected by ID.
     *
     * @param {number} vizId
     * @returns {Promise<IVisualization>}
     */
    getOne(vizId: number): Promise<IVisualization>;
    /**
     * Return visualizations ordered with folders hierarchy.
     *
     * @returns {Promise<ITreeChildren>}
     */
    getTree(): Promise<Array<ITreeChildren>>;
    /**
     * Remove visualization selected by id.
     *
     * @param {number} vizId
     * @returns {Promise<boolean>}
     */
    deleteOne(vizId: number): Promise<boolean>;
    /**
     * Get all share rights on a visualization
     * @param {number} vizId
     * @returns {Promise<ISharers>}
     */
    getShares(vizId: number): Promise<ISharers>;
    /**
     * Set the share right of a user on a visualization
     *
     * @param {ISetShareRights} data
     * @returns {Promise<IShare>}
     */
    share(data: Query.ISetShareRights): Promise<IShare>;
    /**
     * Remove a share right of a user on a visualization
     *
     * @param {IUnshareVisualization} data
     * @returns {Promise<boolean>}
     */
    unshare(data: Query.IUnshareVisualization): Promise<boolean>;
    /**
     * Update a property of a folder
     *
     * @param {IUpdateFolder} data
     * @returns {Promise<any>}
     */
    updateFolder(data: Query.IUpdateFolder): Promise<IFolder>;
    /**
     * Update the sandbox of the current user for a given data-source.
     *
     * @param {IUpdateSandbox} data
     * @returns {Promise<boolean>}
     */
    updateSandbox(data: Query.IUpdateSandbox): Promise<boolean>;
    /**
     * Update visualization selected by id.
     *
     * @param {IUpdateVisualization} data
     * @returns {Promise<boolean>}
     */
    update(data: Query.IUpdateVisualization): Promise<boolean>;
}
