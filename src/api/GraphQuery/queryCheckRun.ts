/**
 * Copyright Linkurious SAS 2012 - 2024
 *
 * - Created on 2024-10-29.
 */

import {GenericObject, IDataSourceParams, IGetSubGraphParams} from '../commonTypes';
import {LkSubGraph} from '../graphItemTypes';

import {Template} from './queryTemplates';
import {GraphQueryDialect, GraphQueryInputType, GraphQueryType} from './queryCRUD';

export interface ICheckQueryParams extends IDataSourceParams {
  query: string;
  dialect?: GraphQueryDialect;
  isCaseAttributesQuery?: boolean;
  expectedOutputFields?: string[];
}

export interface CheckQueryResponse {
  write: boolean;
  type: GraphQueryType;
  graphInput?: GraphQueryInputType; // defined only if type='template'
  templateFields?: Template[]; // defined only if type='template'
  missingOutputFields?: boolean; // defined only if expectedOutputFields is defined
}

export interface IRunQueryParams extends IDataSourceParams {
  dialect?: GraphQueryDialect;
  limit?: number;
  timeout?: number;
  templateData?: GenericObject;
}

export interface IRunQueryByContentParams extends IGetSubGraphParams, IRunQueryParams {
  query: string;
}

export interface RunQueryResponse extends LkSubGraph {
  truncatedByLimit: boolean;
  truncatedByAccess: boolean;
}

export interface IRunQueryByIdParams extends IGetSubGraphParams, IRunQueryParams {
  id: number | string;
}

export interface ErrorHighlight {
  offset: number;
  length?: number;
}
