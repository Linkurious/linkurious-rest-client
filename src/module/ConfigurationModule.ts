/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-02.
 */

// TS2019-DONE

import {
  IDeleteDataSourceConfigParams,
  IGetApplicationConfigResponse,
  IConfigurationParams,
  IDataSourceConfigParams,
  IResetConfigParams,
  SelectedDataSourceConfig,
  IGetApplicationConfigParams
} from '../models/Configuration';
import {Success} from '../response/success';
import {Unauthorized} from '../response/errors';

import {Module} from './Module';

export class ConfigurationModule extends Module {
  /**
   * Return the configuration of the application.
   */
  public getApplicationConfig(
    params: IGetApplicationConfigParams
  ): Promise<Success<IGetApplicationConfigResponse> | Unauthorized> {
    return this.request({
      url: '/config',
      method: 'GET',
      query: {sourceIndex: params.sourceIndex}
    });
  }

  /**
   * Set the configuration of the application.
   */
  public updateApplicationConfig<T>(
    params: IResetConfigParams | IDataSourceConfigParams | IConfigurationParams<T>
  ): Promise<Success<void> | Unauthorized> {
    return this.request({
      url: '/config',
      method: 'POST',
      query: {reset: params.reset, sourceIndex: params.sourceIndex},
      body: params
    });
  }

  /**
   * Create a new data-source configuration.
   * It contains a graph database configuration and an index configuration.
   */
  public createDataSourceConfig(
    params: SelectedDataSourceConfig
  ): Promise<Success<void> | Unauthorized> {
    return this.request({
      url: '/admin/sources/config',
      method: 'POST',
      body: params
    });
  }

  /**
   * Delete a data-source configuration that has currently no connected data-source.
   */
  public deleteDataSourceConfig(
    params: IDeleteDataSourceConfigParams
  ): Promise<Success<void> | Unauthorized> {
    return this.request({
      url: '/admin/sources/config/{sourceIndex}',
      method: 'DELETE',
      path: {sourceIndex: params.dataSourceIndex}
    });
  }
}
