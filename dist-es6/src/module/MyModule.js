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
class MyModule extends Module_1.Module {
    constructor(fetcher) {
        super(fetcher);
    }
    /**
     * Check if the user is authenticated.
     *
     * @returns {Promise<boolean>}
     */
    IsAuth() {
        return this.fetch({
            url: '/auth/authenticated',
            method: 'GET'
        }).then(() => true);
    }
    /**
     * Check if the user is authenticated as an admin.
     *
     * @returns {Promise<boolean>}
     */
    IsAdmin() {
        return this.fetch({
            url: '/auth/admin',
            method: 'GET'
        }).then(() => true);
    }
    /**
     * Delete a saved Graph Query owned by the current user
     *
     * @param {number} graphQueryId
     * @returns {Promise<boolean>}
     */
    deleteGraphQuery(graphQueryId) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/my/rawQuery/{id}',
            method: 'DELETE',
            body: { id: graphQueryId }
        }).then(() => true);
    }
    /**
     * Returns a saved GraphModule Query owned by the current user
     *
     * @param {number} graphQueryId
     * @returns {Promise<IGraphQuery>}
     */
    getGraphQuery(graphQueryId) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/my/rawQuery/{id}',
            method: 'GET',
            query: { id: graphQueryId }
        });
    }
    /**
     * Returns all saved GraphModule Queries owned by the current user
     *
     * @returns {Promise<Array<IGraphQuery>>}
     */
    getAllGraphQueries() {
        return this.fetch({
            url: '/{dataSourceKey}/graph/my/rawQuery/all',
            method: 'GET'
        });
    }
    /**
     * Save and Returns the created GraphQuery
     * @param {ICreateGraphQuery} data
     * @returns {Promise<IGraphQuery>}
     */
    saveGraphQuery(data) {
        return this.fetch({
            url: '/{dataSourceKey}/graph/my/rawQuery',
            method: 'POST',
            body: data
        });
    }
    /**
     * Update a graph query owned but the current user
     *
     * @param {IUpdateGraphQuery} data
     * @returns {Promise<IGraphQuery>}
     */
    updateGraphQuery(data) {
        let body = JSON.parse(JSON.stringify(data));
        body.properties = {
            name: data.name,
            content: data.content
        };
        body.name = undefined;
        body.content = undefined;
        return this.fetch({
            url: '/{dataSourceKey}/graph/my/rawQuery/{id}',
            method: 'PATCH',
            body: body
        }).then(() => true);
    }
}
exports.MyModule = MyModule;
//# sourceMappingURL=MyModule.js.map