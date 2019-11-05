/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-24.
 */

import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';

import {
  IConnectDataSourceParams,
  IGetDataSourcesStatusParams,
  IResetSourceStylesParams,
  ISetDefaultSourceStylesParams,
  DataSource,
  IDeleteSourceDataParams,
  DeleteSourceDataResponse
} from './types';

export * from './types';

const {UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED, FORBIDDEN} = LkErrorKey;

export class DataSourceAPI extends Request {
  /**
   * Get the status of all the data-sources.
   * Users can only see data-sources with at least one group belonging to that data-source.
   * If a user has the "admin.connect" access right, it can also see all the disconnected
   * data-sources.
   */
  public async getDataSourcesStatus(params: IGetDataSourcesStatusParams) {
    const response = await this.handle(UNAUTHORIZED, GUEST_DISABLED).request<DataSource[]>({
      url: '/dataSources',
      method: 'GET',
      params: params
    });

    if (response.isSuccess()){
      this.props.clientState.sources = response.body;
    }

    return response;
  }

  /**
   * Set default design styles and/or captions for the given data-source.
   */
  public setDefaultSourceStyles(params: ISetDefaultSourceStylesParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN).request({
      url: '/admin/source/:sourceKey/setDefaults',
      method: 'POST',
      params: params
    });
  }

  /**
   * Reset design and/or captions of all sandboxes of the given data-source to default values.
   * If `design` is true, set `design.palette` and `design.styles` to default `palette` and `defaultStyles` of the data-source.
   * If `captions` is true, set `nodeFields.captions` and `edgeFields.captions` to current `defaultCaptions.nodes` and `defaultCaptions.edges` of the data-source.
   */
  public resetSourceStyles(params: IResetSourceStylesParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN).request({
      url: '/admin/source/:sourceKey/resetDefaults',
      method: 'POST',
      params: params
    });
  }

  /**
   * Connect a disconnected data-source.
   */
  public connectDataSource(params: IConnectDataSourceParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request({
      url: '/admin/source/:dataSourceIndex/connect',
      method: 'POST',
      params: params
    });
  }

  /**
   * Delete all data of data-source (visualizations, access rights, widgets, full-text indexes).
   * Optionally merge visualizations and widgets into another data-source instead of deleting them.
   * Warning: when merging into another data-source, visualizations may break if node and edge IDs are not the same in the target data-source.
   */
  public deleteSourceData(params: IDeleteSourceDataParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request<DeleteSourceDataResponse>({
      url: '/admin/sources/data/:sourceKey',
      method: 'POST',
      params: params
    });
  }

  public getAllSourceInfo(params: IGetAllSourceInfoParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request<GetAllSourceInfoResponse>({
      url: '/admin/sources',
      method: 'GET',
      params: params
    });
  }

  public createSourceConfig(params: ICreateSourceConfigParams) {
    return this.request<CreateSourceConfigResponse>({
      url: '/admin/sources/config',
      method: 'POST',
      params: params
    });
  }

  public deleteSourceConfig(params: IDeleteSourceConfigParams) {
    return this.request<DeleteSourceConfigResponse>({
      url: '/admin/sources/config/:configIndex',
      method: 'POST',
      params: params
    });
  }
}
