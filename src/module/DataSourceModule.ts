/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-02.
 */
import {Module} from "./Module";
import {
  InvalidParameter,
  Success,
  Unauthorized
} from "../../index";
import {
  IConnectDataSourceParams,
  IDeleteDataSourceParams,
  IDeleteDataSourceResponse,
  IGetAdminDataSourceResponse,
  IGetUserDataSourceParams,
  IGetUserDataSourceResponse,
  IResetDataSourceDefaultsParams,
  ISetDataSourceDefaultsParams
} from "../models/DataSource";

export class DataSourceModule extends Module {
  /**
   * Get the status of the all data-sources.
   */
  public getUserDataSources(params?: IGetUserDataSourceParams
  ): Promise<Success<IGetUserDataSourceResponse> | Unauthorized | InvalidParameter> {
    return this.request({
      url: "/dataSources", // replaces Linkurious.getSourceList
      method: "GET",
      query: params
    });
  }

  /**
   * Get information for all data-source, including data-sources that do not exist online.
   */
  public getAdminDataSources()
    : Promise<Success<IGetAdminDataSourceResponse> | Unauthorized | InvalidParameter> {
    return this.request({
      url: "/admin/sources", // replaces AdminModule.getDataSourcesList
      method: "GET"
    });
  }

  /**
   * Connect a disconnected data-source.
   */
  public connectDataSource(params: IConnectDataSourceParams
  ): Promise<Success<void> | Unauthorized> | InvalidParameter {
    return this.request({
      url: "/admin/source/{sourceIndex}/connect", // replaces AdminModule.connectDataSource
      method: "POST",
      path: {sourceIndex: params.sourceIndex}
    });
  }

  /**
   * Reset all default styles for a dataSource.
   */
  public resetDefaults(params: IResetDataSourceDefaultsParams
  ): Promise<Success<void> | Unauthorized> | InvalidParameter {
    return this.request({
      url: "/admin/source/{sourceKey}/resetDefaults", // replaces AdminModule.resetDefaults
      method: "POST",
      body: params,
      path: {sourceKey: params.sourceKey}
    });
  }

  /**
   * Set all default styles for a dataSource.
   */
  public setDefaults(params: ISetDataSourceDefaultsParams
  ): Promise<Success<void> | Unauthorized | InvalidParameter>{
    return this.request({
      url: "/admin/source/{sourceKey}/setDefaults", // replaces AdminModule.setDefaults
      method: "POST",
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
  public deleteDataSource(params: IDeleteDataSourceParams
  ): Promise<Success<IDeleteDataSourceResponse> | Unauthorized | InvalidParameter> {
    return this.request({
      url: "/admin/sources/data/{sourceKey}", // replaces AdminModule.deleteFullDataSource
      method: "DELETE",
      query: {mergeInto: params.mergeInto},
      path: {sourceKey: params.sourceKey}
    });
  }

}
