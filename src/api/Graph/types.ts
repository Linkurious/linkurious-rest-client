/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

export interface ISearchFullParams {}

export interface SearchFullResponse {}

export interface ISearchParams {}

export interface SearchResponse {}

export interface ICheckQueryParams {}

export interface CheckQueryResponse {}

export interface IRunQueryByContentParams {}

export interface RunQueryByContentResponse {}

export interface IRunQueryByIdParams {}

export interface RunQueryByIdResponse {}

export interface IAlertPreviewParams {}

export interface AlertPreviewResponse {}

export interface IGetStatisticsParams {}

export interface GetStatisticsResponse {}

export interface IGetAdjacentNodesParams {}

export interface GetAdjacentNodesResponse {}

// import {LkEdge, LkNode, LkSubGraph} from '../graphItemTypes';
// import {GenericObject, IDataSourceParams} from '../commonTypes';
// import {EntityType} from '../GraphSchema';
// import {
//   ColumnTypeValues,
//   GraphInputType,
//   GraphQueryDialect,
//   GraphQueryType,
//   TemplateField
// } from '../GraphQuery';
//
// export interface IGetDigestParams extends IDataSourceParams {
//   ids: string[] | number[];
//   withDigest?: boolean;
//   withDegree?: boolean;
// }
//
// export interface IGetAdjacentNodesParams extends IDataSourceParams {
//   ids: string[] | number[];
//   edgesTo?: string[] | number[];
//   nodeCategories?: string[];
//   edgeTypes?: string[];
//   limit?: number;
//   limitType?: string;
//   withDigest?: boolean;
//   withDegree?: boolean;
// }
//
// export interface ISimpleSearchParams extends IDataSourceParams {
//   type: EntityType;
//   q: string;
//   fuzziness?: number;
//   size?: number;
//   from?: number;
// }
//
// export interface IAdvancedSearchParams extends ISimpleSearchParams {
//   filter?: Array<[string, string]>;
//   categoriesOrTypes?: string[];
// }
//
// export interface GraphSearchResponse {
//   type: EntityType;
//   totalHits?: number;
//   moreResults?: boolean;
//   results: LkNode[] | LkEdge[];
// }
//
// export interface ISearchFullParams extends IAdvancedSearchParams {
//   edgesTo?: string[];
//   withDigest?: boolean;
//   withDegree?: boolean;
// }
//
// export interface ICheckGraphQueryParams extends IDataSourceParams {
//   query: string;
//   dialect?: GraphQueryDialect;
// }
//
// export interface CheckGraphQueryResponse {
//   write: boolean;
//   type: GraphQueryType;
//   graphInput?: GraphInputType;
//   templateFields?: TemplateField[];
// }
//
// export interface IAlertPreviewParams {
//   query: string;
//   dialect?: GraphQueryDialect;
//   columns?: Array<{columnName: string; columnTitle?: string; type: ColumnTypeValues}>;
//   limit?: number;
//   timeout?: number;
// }
// export interface AlertPreviewResponse {
//   results: Array<{
//     nodes: LkNode[];
//     edges: LkEdge[];
//     columns: Array<string | number>;
//   }>;
// }
//
// export interface IRunGraphQueryParams extends IDataSourceParams {
//   dialect?: string;
//   limit?: number;
//   timeout?: number;
//   edgesTo?: Array<string | number>;
//   withDegree?: boolean;
//   withDigest?: boolean;
//   templateData?: GenericObject;
// }
//
// export interface IRunGraphQueryByContentParams extends IRunGraphQueryParams {
//   query: string;
// }
//
// export interface IRunGraphQueryByIdParams extends IRunGraphQueryParams {
//   id: number;
// }
//
// export interface RunGraphQueryResponse extends LkSubGraph {
//   truncatedByLimit: boolean;
//   truncatedByAccess: boolean;
// }
