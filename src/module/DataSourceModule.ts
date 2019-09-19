/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-02.
 */

// TS2019-DONE

import {Success, Unauthorized} from '../../index';
import {
  IConnectDataSourceParams,
  IDeleteDataSourceParams,
  IDeleteDataSourceResponse,
  GetAdminDataSourcesResponse,
  IGetUserDataSourcesParams,
  GetUserDataSourcesResponse,
  IResetDataSourceDefaultsParams,
  ISetDataSourceDefaultsParams
} from '../models/DataSource';

import {Module} from './Module';

export class DataSourceModule extends Module {
  /**
   * Get the status of the all data-sources.
   */
  public getUserDataSources(
    params?: IGetUserDataSourcesParams
  ): Promise<Success<GetUserDataSourcesResponse> | Unauthorized> {
    return this.request({
      url: '/dataSources',
      method: 'GET',
      query: params
    });
  }

  /**
   * Get information for all data-source, including data-sources that do not exist online.
   */
  public getAdminDataSources(): Promise<Success<GetAdminDataSourcesResponse> | Unauthorized> {
    return this.request({
      url: '/admin/sources',
      method: 'GET'
    });
  }

  /**
   * Connect a disconnected data-source.
   */
  public connectDataSource(
    params: IConnectDataSourceParams
  ): Promise<Success<void> | Unauthorized> {
    return this.request({
      url: '/admin/source/{sourceIndex}/connect',
      method: 'POST',
      path: {sourceIndex: params.sourceIndex}
    });
  }

  /**
   * Reset all default styles for a dataSource.
   */
  public resetDataSourceDefaults(
    params: IResetDataSourceDefaultsParams
  ): Promise<Success<void> | Unauthorized> {
    return this.request({
      url: '/admin/source/{sourceKey}/resetDefaults',
      method: 'POST',
      body: params,
      path: {sourceKey: params.sourceKey}
    });
  }

  /**
   * Set all default styles for a dataSource.
   */
  public setDataSourceDefaults(
    params: ISetDataSourceDefaultsParams
  ): Promise<Success<void> | Unauthorized> {
    return this.request({
      url: '/admin/source/{sourceKey}/setDefaults',
      method: 'POST',
      body: params,
      path: {sourceKey: params.sourceKey}
    });
  }

  /**
   * Delete all data of data-source (visualizations, access-rights, widgets, full-text indexes).
   * Optionally merge visualizations and widgets into another data-source instead of deleting them.
   * Warning: when merging into another data-source, visualizations may break if node and edge IDs
   * are not the same in to target data-source.
   */
  public deleteDataSource(
    params: IDeleteDataSourceParams
  ): Promise<Success<IDeleteDataSourceResponse> | Unauthorized> {
    return this.request({
      url: '/admin/sources/data/{sourceKey}',
      method: 'DELETE',
      query: {mergeInto: params.mergeInto},
      path: {sourceKey: params.sourceKey}
    });
  }
}
