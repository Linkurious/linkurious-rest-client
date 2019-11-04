/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';

import {
  AlertPreviewResponse,
  CheckQueryResponse,
  GetAdjacentNodesResponse,
  GetStatisticsResponse,
  IAlertPreviewParams,
  ICheckQueryParams,
  IGetAdjacentNodesParams,
  IGetStatisticsParams,
  IRunQueryByContentParams,
  IRunQueryByIdParams,
  ISearchFullParams,
  ISearchParams,
  RunQueryByContentResponse,
  RunQueryByIdResponse,
  SearchFullResponse,
  SearchResponse
} from './types';

export * from './types';

// TODO make sure data-source unavailable is thrown instead of graph_unreachable
const {
  UNAUTHORIZED,
  DATA_SOURCE_UNAVAILABLE,
  GUEST_DISABLED,
  FORBIDDEN,
  NOT_FOUND,
  BAD_GRAPH_REQUEST,
  GRAPH_REQUEST_TIMEOUT,
  CONSTRAINT_VIOLATION
} = LkErrorKey;

export class GraphAPI extends Request {
  /**
   * Perform a search of nodes or edges based on a search query, a fuzziness value and filters.
   * The list of items that matched the search query is returned.
   */
  public search(params: ISearchParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED).request<
      SearchResponse
    >({
      url: '/:sourceKey/search/:type',
      method: 'POST',
      params: params
    });
  }

  /**
   * Perform a search of nodes or edges based on a search query, a fuzziness value and filters.
   * A subgraph made of the items that matched the search query and the edges between them is returned.
   */
  public searchFull(params: ISearchFullParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED).request<
      SearchFullResponse
    >({
      url: '/:sourceKey/search/:type/full',
      method: 'POST',
      params: params
    });
  }

  /**
   * Check that the given graph query is syntactically correct. Parse the query if it's a template.
   */
  public checkQuery(params: ICheckQueryParams) {
    return this.handle(
      UNAUTHORIZED,
      DATA_SOURCE_UNAVAILABLE,
      FORBIDDEN,
      BAD_GRAPH_REQUEST,
      CONSTRAINT_VIOLATION,
      GRAPH_REQUEST_TIMEOUT
    ).request<CheckQueryResponse>({
      url: '/:sourceKey/graph/check/query',
      method: 'POST',
      params: params
    });
  }

  /**
   * Get all the nodes and edges matching the given graph query.
   * A subgraph made of all the nodes and the edges from each subgraph matching the graph query is returned.
   */
  public runQuery(params: IRunQueryByContentParams) {
    return this.handle(
      UNAUTHORIZED,
      DATA_SOURCE_UNAVAILABLE,
      FORBIDDEN,
      BAD_GRAPH_REQUEST,
      CONSTRAINT_VIOLATION,
      GRAPH_REQUEST_TIMEOUT
    ).request<RunQueryByContentResponse>({
      url: '/:sourceKey/graph/run/query',
      method: 'POST',
      params: params
    });
  }

  /**
   * Get all the nodes and edges matching the given saved graph query by id.
   * A subgraph made of all the nodes and the edges from each subgraph matching the graph query is returned.
   */
  public runQueryById(params: IRunQueryByIdParams) {
    return this.handle(
      UNAUTHORIZED,
      DATA_SOURCE_UNAVAILABLE,
      GUEST_DISABLED,
      FORBIDDEN,
      BAD_GRAPH_REQUEST,
      CONSTRAINT_VIOLATION,
      GRAPH_REQUEST_TIMEOUT
    ).request<RunQueryByIdResponse>({
      url: '/:sourceKey/graph/run/query/:id',
      method: 'POST',
      params: params
    });
  }

  /**
   * Get all the nodes and edges matching the given graph query.
   * An array of subgraphs, one for each subgraph matching the graph query, is returned.
   */
  public alertPreview(params: IAlertPreviewParams) {
    return this.handle(
      UNAUTHORIZED,
      DATA_SOURCE_UNAVAILABLE,
      FORBIDDEN,
      BAD_GRAPH_REQUEST,
      CONSTRAINT_VIOLATION,
      GRAPH_REQUEST_TIMEOUT
    ).request<AlertPreviewResponse>({
      url: '/:sourceKey/graph/alertPreview',
      method: 'POST',
      params: params
    });
  }

  /**
   * Get the digest (the number of adjacent nodes and edges grouped by node categories and edge types)
   * and/or the degree of a given subset of nodes.
   * You can't get aggregated statistics of a subset of nodes containing one or more supernodes.
   * To get the statistics of a supernode invoke the API with only its node ID.
   */
  public getStatistics(params: IGetStatisticsParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED, NOT_FOUND).request<
      GetStatisticsResponse
    >({
      url: '/:sourceKey/graph/neighborhood/statistics',
      method: 'POST',
      params: params
    });
  }

  /**
   * Get all the adjacent nodes and edges to one or more source nodes.
   * A subgraph made of the items that matched the expand query and the edges between them is returned.
   */
  public getAdjacentNodes(params: IGetAdjacentNodesParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED, NOT_FOUND).request<
      GetAdjacentNodesResponse
    >({
      url: '/:sourceKey/graph/nodes/expand',
      method: 'POST',
      params: params
    });
  }
}
