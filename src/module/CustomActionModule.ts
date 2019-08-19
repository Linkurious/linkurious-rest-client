/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

import {DataSourceUnavailable, Forbidden, InvalidParameter, NotFound, Unauthorized} from '../response/errors';
import {Success} from '../response/success';
import {Module} from './Module';

import {
    ICreateCustomActionParams,
    ICreateCustomActionResponse,
    IDeleteCustomActionParams,
    IUpdateCustomActionParams,
    IUpdateCustomActionResponse,
    IGetCustomActionsParams,
    IGetCustomActionsResponse
} from '../models/CustomAction';

export class CustomActionModule extends Module {

    public async createCustomAction(options: ICreateCustomActionParams):
        Promise<
            Success<ICreateCustomActionResponse> |
            Unauthorized | Forbidden | DataSourceUnavailable| InvalidParameter
        >
    {
        return this.request({
            url: '/admin/{sourceKey}/customAction',
            method: 'POST',
            body: options,
            path: {
                sourceKey: options.sourceKey
            }
        });
    }

    public async deleteCustomAction(options: IDeleteCustomActionParams):
        Promise<
            Success<void> |
            Unauthorized | Forbidden | DataSourceUnavailable | NotFound
        >
    {
        return this.request({
            url: '/admin/{sourceKey}/customAction/{id}',
            method: 'DELETE',
            body: options,
            path: {
                sourceKey: options.sourceKey,
                id: options.id
            }
        });
    }

    public async updateCustomAction(options: IUpdateCustomActionParams):
        Promise<
            Success<IUpdateCustomActionResponse> |
            Unauthorized | Forbidden | DataSourceUnavailable | NotFound
        >
    {
        return this.request({
            url: '/admin/{sourceKey}/customAction/{id}',
            method: 'PATCH',
            body: options,
            path: {
                sourceKey: options.sourceKey,
                id: options.id
            }
        });
    }

    public async getCustomActions(options: IGetCustomActionsParams):
        Promise<
            Success<IGetCustomActionsResponse> |
            Unauthorized | Forbidden | DataSourceUnavailable
        >
    {
        return this.request({
            url: '/admin/{sourceKey}/customAction',
            method: 'GET',
            path: {
                sourceKey: options.sourceKey
            }
        });
    }
}
