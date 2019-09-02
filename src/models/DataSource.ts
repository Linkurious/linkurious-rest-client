/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-02.
 */
import { GenericObject, ICaptionsConfig } from "./Configuration";

export interface IDataSourceParams {
  sourceKey?: string;
}

export interface IConnectDataSourceParams {
  sourceIndex: number;
}

export interface IResetDataSourceDefaultsParams extends IDataSourceParams {
  design?: boolean;
  captions?: boolean;
}

export interface IDataSourceStyle {
  node: Array<GenericObject<unknown>>;
  edge: Array<GenericObject<unknown>>;
}

export interface IGetUserDataSourceParams {
  withStyles?: boolean;
  withCaptions?: boolean;
}


export interface ISetDataSourceDefaultsParams extends IDataSourceParams {
  styles?: IDataSourceStyle;
  captions?: ICaptionsConfig;
}

export interface IDeleteDataSourceParams extends IDataSourceParams {
  mergeInto?: string;
}
