/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */
import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';
import {
  IAlertPreviewParams, AlertPreviewResponse,
  IRunGraphQueryByContentParams,
  IRunGraphQueryByIdParams,
  RunGraphQueryResponse
} from '../GraphQuery/types';
import { IGetAdjacentNodesParams, IGetDigestParams, LkNodeStatistics, SubGraph, IAdvancedSearchParams, ISearchFullParams, GraphSearchResponse} from './types';
const {UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, BAD_GRAPH_REQUEST, CONSTRAINT_VIOLATION, GRAPH_REQUEST_TIMEOUT, GRAPH_UNREACHABLE, GUEST_DISABLED} = LkErrorKey;

export class GraphApi extends Request {
  /**
   * Search for nodes based on a query string and optional parameters. Return a list of full Nodes.
   */
  public SearchAndAddSubGraph(params: ISearchFullParams) {
    return this
      .handle(UNAUTHORIZED)
      .request<SubGraph>({
          url: '/:sourceKey/search/:type/full',
          method: 'POST',
          params: params
        }
      );
  }

  /**
   * Search for items with filters.
   */
  public search(params: IAdvancedSearchParams) {
    return this
      .handle(UNAUTHORIZED)
      .request<GraphSearchResponse>({
          url: '/:sourceKey/search/:type',
          method: 'POST',
          params: params
        }
      );
  }

  /**
   * Run a static or template query.
   */
  public runQuery(params: IRunGraphQueryByContentParams) {
    return this
      .handle(
        UNAUTHORIZED,
        FORBIDDEN,
        BAD_GRAPH_REQUEST,
        CONSTRAINT_VIOLATION,
        GRAPH_REQUEST_TIMEOUT,
        DATA_SOURCE_UNAVAILABLE,
        GRAPH_UNREACHABLE
      )
      .request<RunGraphQueryResponse>({
          url: '/:sourceKey/graph/run/query',
          method: 'POST',
          params: params,
          query: {
            withDigest: params.withDigest,
            withDegree: params.withDegree,
            withAccess: params.withAccess
          }
        }
      );
  }

  /**
   * Run a static or template query.
   */
  public runQueryById(params: IRunGraphQueryByIdParams) {
    return this
      .handle(
        UNAUTHORIZED,
        FORBIDDEN,
        GUEST_DISABLED,
        BAD_GRAPH_REQUEST,
        CONSTRAINT_VIOLATION,
        GRAPH_REQUEST_TIMEOUT,
        DATA_SOURCE_UNAVAILABLE,
        GRAPH_UNREACHABLE
      )
      .request<RunGraphQueryResponse>({
          url: '/:sourceKey/graph/run/query/:id',
          method: 'POST',
          params: params,
          query: {
            withDegree: params.withDegree,
            withAccess: params.withAccess,
            withDigest: params.withDigest
          }
        }
      );
  }

  /**
   * Preview the result of a query.
   */
  public alertPreview(params: IAlertPreviewParams) {
    return this
      .handle(
        UNAUTHORIZED,
        FORBIDDEN,
        GUEST_DISABLED,
        BAD_GRAPH_REQUEST,
        CONSTRAINT_VIOLATION,
        GRAPH_REQUEST_TIMEOUT,
        DATA_SOURCE_UNAVAILABLE,
        GRAPH_UNREACHABLE
      )
      .request<AlertPreviewResponse>({
          url: '/:sourceKey/graph/alertPreview',
          method: 'POST',
          params: params
        }
      );
  }

  /**
   * Get node-categories and edge-types of neighbors.
   */
  public getDigest(params: IGetDigestParams) {
    return this
      .handle(UNAUTHORIZED, FORBIDDEN)
      .request<LkNodeStatistics>({
        url: '/:sourceKey/graph/neighborhood/statistics',
        method: 'POST',
        params: params,
        query: {
          withDigest: params.withDigest,
          withDegree: params.withDegree
        }
    });
  }

  /**
   * Get all adjacent nodes and edges for one or many source nodes (ids). The result is an array of
   * nodes containing the sources nodes (ids) and their neighbors. Edges between sources nodes and
   * neighbors - as well as edges between neighbors themselves - are returned in each node's edges
   * field. If visible_nodes was specified, edges between source nodes or their neighbors and
   * visible nodes are also included.
   */
  public expand(params: IGetAdjacentNodesParams) {
    return this.request<SubGraph>({
      url: '/:sourceKey/graph/nodes/expand',
      method: 'POST',
      params: params,
      query: {
        withDigest: params.withDigest,
        withDegree: params.withDegree
      }
    })
  }
}
