/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-24.
 */

import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';
import {SelectedDataSourceConfig} from '../Config';
import {hasValue} from '../../utils';
import {RestClient} from '../../index';

import {
  IConnectDataSourceParams,
  IGetDataSourcesStatusParams,
  IResetSourceStylesParams,
  ISetDefaultSourceStylesParams,
  DataSourceUserInfo,
  IDeleteSourceDataParams,
  DeleteSourceDataResponse,
  IDeleteSourceConfigParams,
  DataSourceAdminInfo
} from './types';

export * from './types';

const {
  UNAUTHORIZED,
  DATA_SOURCE_UNAVAILABLE,
  GUEST_DISABLED,
  FORBIDDEN,
  ILLEGAL_SOURCE_STATE
} = LkErrorKey;

export class DataSourceAPI extends Request {
  /**
   * Get the status of all the data-sources.
   * Users can only see data-sources with at least one group belonging to that data-source.
   * If a user has the "admin.connect" access right, it can also see all the disconnected
   * data-sources.
   */
  public async getDataSources(
    this: Request<DataSourceUserInfo[]>,
    params?: IGetDataSourcesStatusParams
  ) {
    const response = await this.request({
      errors: [UNAUTHORIZED, GUEST_DISABLED],
      url: '/dataSources',
      method: 'GET',
      params: params
    });

    if (response.isSuccess()) {
      this.props.clientState.sources = response.body;

      if (!hasValue(this.props.clientState.currentSource)) {
        try {
          const currentSource = RestClient.getCurrentSource(
            this.props.clientState.sources || [],
            this.props.clientState.user && {userId: this.props.clientState.user.id}
          );
          this.props.clientState.currentSource = currentSource;
          if (hasValue(currentSource.key) && hasValue(this.props.clientState.user)) {
            localStorage.setItem(
              'lk-lastSeenSourceKey-' + this.props.clientState.user.id,
              currentSource.key
            );
          }
        } catch (_) {
          // Silently fail if localStorage is not supported or if there are no sources configured
        }
      }
    }

    return response;
  }

  /**
   * Set default design styles and/or captions for the given data-source.
   */
  public setDefaultSourceStyles(params: ISetDefaultSourceStylesParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN],
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
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN],
      url: '/admin/source/:sourceKey/resetDefaults',
      method: 'POST',
      params: params
    });
  }

  /**
   * Connect a disconnected data-source.
   */
  public connectDataSource(params: IConnectDataSourceParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN],
      url: '/admin/source/:sourceIndex/connect',
      method: 'POST',
      params: params
    });
  }

  /**
   * Delete all data of data-source (visualizations, access rights, widgets, full-text indexes).
   * Optionally merge visualizations and widgets into another data-source instead of deleting them.
   * Warning: when merging into another data-source, visualizations may break if node and edge IDs are not the same in the target data-source.
   */
  public deleteSourceData(
    this: Request<DeleteSourceDataResponse>,
    params: IDeleteSourceDataParams
  ) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN],
      url: '/admin/sources/data/:sourceKey',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Delete a data-source configuration that has currently no connected data-source.
   */
  public deleteSourceConfig(params: IDeleteSourceConfigParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, ILLEGAL_SOURCE_STATE],
      url: '/admin/sources/config/:configIndex',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Get the admin info of all the data-sources, including:
   * - a disconnected data-source configuration
   * - a disconnected data-source state not configured anymore
   * - a connected data-source (data-source configuration + state)
   */
  public getDataSourcesAdminInfo(this: Request<DataSourceAdminInfo[]>) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN],
      url: '/admin/sources',
      method: 'GET'
    });
  }

  /**
   * Create a new data-source configuration made of a graph database configuration
   * and an index configuration. Return the configuration index of the new data-source.
   */
  public createSourceConfig(this: Request<number>, params: SelectedDataSourceConfig) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN],
      url: '/admin/sources/config',
      method: 'POST',
      params: params
    });
  }
}
