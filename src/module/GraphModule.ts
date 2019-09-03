/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2016-05-30.
 */

import {IEdge, IGraphQuery, INode, IOgmaEdge, IOgmaNode} from '../../index';
import {ErrorListener} from '../errorListener';
import {Fetcher} from '../http/fetcher';
import {
  BadGraphRequest,
  ConstraintViolation,
  DataSourceUnavailable,
  Forbidden,
  GraphRequestTimeout,
  GraphUnreachable,
  GuestDisabled,
  InvalidParameter,
  NotFound,
  Unauthorized
} from '../response/errors';
import {Success} from '../response/success';
import {Transformer} from '../transformer';

import {Module} from './Module';
import {VisualizationParser} from './VisualizationParser';

export class GraphModule extends Module {
  constructor(fetcher: Fetcher, transformer: Transformer, errorListener: ErrorListener) {
    super(fetcher, transformer, errorListener);
  }

  /**
   * Returns a saved GraphModule Query owned by the current user
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<IGraphQuery>}
   */
  public getGraphQuery(
    data: {
      id: number;
    },
    dataSourceKey?: string
  ): Promise<
    | Success<IGraphQuery>
    | Unauthorized
    | GuestDisabled
    | Forbidden
    | BadGraphRequest
    | ConstraintViolation
    | GraphRequestTimeout
    | DataSourceUnavailable
    | GraphUnreachable
    | InvalidParameter
  > {
    return this.request({
      url: '/{sourceKey}/graph/query/{id}',
      method: 'GET',
      query: data,
      path: {sourceKey: dataSourceKey}
    }) as Promise<
      | Success<IGraphQuery>
      | Unauthorized
      | GuestDisabled
      | Forbidden
      | BadGraphRequest
      | ConstraintViolation
      | GraphRequestTimeout
      | DataSourceUnavailable
      | GraphUnreachable
      | InvalidParameter
    >;
  }

  /**
   * Returns all saved GraphModule Queries owned by the current user
   *
   * @param {{ type:'static'|'template'}} data
   * @param {string} dataSourceKey
   * @returns {Promise<Array<IGraphQuery>>}
   */
  public getAllGraphQueries(
    data: {type: 'static' | 'template'},
    dataSourceKey?: string
  ): Promise<
    | Success<IGraphQuery[]>
    | Unauthorized
    | GuestDisabled
    | Forbidden
    | BadGraphRequest
    | ConstraintViolation
    | GraphRequestTimeout
    | DataSourceUnavailable
    | GraphUnreachable
    | InvalidParameter
  > {
    return this.request({
      url: '/{sourceKey}/graph/query',
      method: 'GET',
      path: {sourceKey: dataSourceKey},
      query: data
    }) as Promise<
      | Success<IGraphQuery[]>
      | Unauthorized
      | GuestDisabled
      | Forbidden
      | BadGraphRequest
      | ConstraintViolation
      | GraphRequestTimeout
      | DataSourceUnavailable
      | GraphUnreachable
      | InvalidParameter
    >;
  }

  /**
   * Run a static or template query
   */
  public run(
    data: {
      query: string;
      dialect?: string;
      limit?: number;
      timeout?: number;
      edgesTo?: Array<string | number>;
      withAccess?: boolean;
      withDegree?: boolean;
      withDigest?: boolean;
      templateData?: any;
    },
    dataSourceKey?: string
  ): Promise<
    | Success<{
        nodes: IOgmaNode[];
        edges: IOgmaEdge[];
        truncatedByLimit: boolean;
        truncatedByAccess: boolean;
      }>
    | Unauthorized
    | GuestDisabled
    | Forbidden
    | BadGraphRequest
    | ConstraintViolation
    | GraphRequestTimeout
    | DataSourceUnavailable
    | GraphUnreachable
    | InvalidParameter
  > {
    const body: any = {
      dialect: data.dialect,
      query: data.query,
      limit: data.limit,
      timeout: data.timeout,
      templateData: data.templateData
    };
    const query: any = {
      withDigest: data.withDigest,
      withDegree: data.withDegree,
      withAccess: data.withAccess
    };
    return this.request<
      {
        nodes: INode[];
        edges: IEdge[];
        truncatedByLimit: boolean;
        truncatedByAccess: boolean;
      },
      {
        nodes: IOgmaNode[];
        edges: IOgmaEdge[];
        truncatedByLimit: boolean;
        truncatedByAccess: boolean;
      }
    >({
      url: '/{sourceKey}/graph/run/query',
      method: 'POST',
      body: body,
      query: query,
      path: {sourceKey: dataSourceKey},
      transform: res => {
        return {
          nodes: res.nodes.map(n => VisualizationParser.parseNode(n)),
          edges: res.edges.map(e => VisualizationParser.parseEdge(e)),
          truncatedByLimit: res.truncatedByLimit,
          truncatedByAccess: res.truncatedByAccess
        };
      }
    }) as Promise<
      | Success<{
          nodes: IOgmaNode[];
          edges: IOgmaEdge[];
          truncatedByLimit: boolean;
          truncatedByAccess: boolean;
        }>
      | Unauthorized
      | GuestDisabled
      | Forbidden
      | BadGraphRequest
      | ConstraintViolation
      | GraphRequestTimeout
      | DataSourceUnavailable
      | GraphUnreachable
      | InvalidParameter
    >;
  }

  /**
   * Run a static or template query
   */
  public runById(
    data: {
      id: number;
      limit?: number;
      timeout?: number;
      edgesTo?: Array<string | number>;
      templateData?: any;
      withDegree?: boolean;
      withAccess?: boolean;
      withDigest?: boolean;
    },
    dataSourceKey?: string
  ): Promise<
    | Success<{
        nodes: IOgmaNode[];
        edges: IOgmaEdge[];
        truncatedByLimit: boolean;
        truncatedByAccess: boolean;
      }>
    | Unauthorized
    | GuestDisabled
    | Forbidden
    | BadGraphRequest
    | ConstraintViolation
    | GraphRequestTimeout
    | DataSourceUnavailable
    | GraphUnreachable
    | InvalidParameter
  > {
    const body: any = {
      id: data.id,
      limit: data.limit,
      timeout: data.timeout,
      edgesTo: data.edgesTo,
      templateData: data.templateData
    };
    const query: any = {
      withDegree: data.withDegree,
      withAccess: data.withAccess,
      withDigest: data.withDigest
    };
    return this.request<
      {
        nodes: INode[];
        edges: IEdge[];
        truncatedByLimit: boolean;
        truncatedByAccess: boolean;
      },
      {
        nodes: IOgmaNode[];
        edges: IOgmaEdge[];
        truncatedByLimit: boolean;
        truncatedByAccess: boolean;
      }
    >({
      url: '/{sourceKey}/graph/run/query/{id}',
      method: 'POST',
      query: query,
      body: body,
      path: {sourceKey: dataSourceKey},
      transform: res => {
        return {
          nodes: res.nodes.map(n => VisualizationParser.parseNode(n)),
          edges: res.edges.map(e => VisualizationParser.parseEdge(e)),
          truncatedByLimit: res.truncatedByLimit,
          truncatedByAccess: res.truncatedByAccess
        };
      }
    }) as Promise<
      | Success<{
          nodes: IOgmaNode[];
          edges: IOgmaEdge[];
          truncatedByLimit: boolean;
          truncatedByAccess: boolean;
        }>
      | Unauthorized
      | GuestDisabled
      | Forbidden
      | BadGraphRequest
      | ConstraintViolation
      | GraphRequestTimeout
      | DataSourceUnavailable
      | GraphUnreachable
      | InvalidParameter
    >;
  }

  /**
   * Return resolve if the current query is valid
   */
  public check(
    data: {
      query: string;
      dialect?: string;
    },
    dataSourceKey?: string
  ): Promise<
    | Success<{write: boolean; type: 'static' | 'template'}>
    | Unauthorized
    | Forbidden
    | BadGraphRequest
    | ConstraintViolation
    | GraphRequestTimeout
    | DataSourceUnavailable
    | GraphUnreachable
    | InvalidParameter
  > {
    return this.request({
      url: '/{sourceKey}/graph/check/query',
      method: 'POST',
      body: data,
      path: {sourceKey: dataSourceKey}
    }) as Promise<
      | Success<{write: boolean; type: 'static' | 'template'}>
      | Unauthorized
      | Forbidden
      | BadGraphRequest
      | ConstraintViolation
      | GraphRequestTimeout
      | DataSourceUnavailable
      | GraphUnreachable
      | InvalidParameter
    >;
  }

  /**
   * Preview the result of a query
   *
   * @param {any} data
   * @param {string} dataSourceKey
   * @returns {Promise<any>}
   */
  public preview(
    data: {
      query: string;
      dialect?: string;
      limit?: number;
      timeout?: number;
      columns?: any;
    },
    dataSourceKey?: string
  ): Promise<
    | Success<Array<{nodes: IOgmaNode[]; edges: IOgmaEdge[]; columns: any}>>
    | Unauthorized
    | GuestDisabled
    | Forbidden
    | BadGraphRequest
    | ConstraintViolation
    | GraphRequestTimeout
    | DataSourceUnavailable
    | GraphUnreachable
    | InvalidParameter
  > {
    const body: any = {
      query: data.query,
      dialect: data.dialect,
      limit: data.limit,
      timeout: data.timeout,
      columns: data.columns
    };
    return this.request<
      {results: Array<{nodes: INode[]; edges: IEdge[]; columns: any}>},
      Array<{nodes: IOgmaNode[]; edges: IOgmaEdge[]; columns: any}>
    >({
      url: '/{sourceKey}/graph/alertPreview',
      method: 'POST',
      body: body,
      path: {sourceKey: dataSourceKey},
      transform: res => {
        return res.results.map(result => {
          return {
            nodes: result.nodes.map((n: INode) => VisualizationParser.parseNode(n)),
            edges: result.edges.map((e: IEdge) => VisualizationParser.parseEdge(e)),
            columns: result.columns
          };
        });
      }
    }) as Promise<
      | Success<Array<{nodes: IOgmaNode[]; edges: IOgmaEdge[]; columns: any}>>
      | Unauthorized
      | GuestDisabled
      | Forbidden
      | BadGraphRequest
      | ConstraintViolation
      | GraphRequestTimeout
      | DataSourceUnavailable
      | GraphUnreachable
      | InvalidParameter
    >;
  }

  /**
   * Save and Returns the created GraphQuery
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<IGraphQuery>}
   */
  public saveGraphQuery(
    data: {
      name: string;
      content: string;
      dialect?: 'cypher' | 'gremlin' | 'sparql';
      description: string;
      sharing: 'private' | 'source' | 'groups';
      sharedWithGroups?: number[];
    },
    dataSourceKey?: string
  ): Promise<
    | Success<IGraphQuery>
    | Unauthorized
    | Forbidden
    | BadGraphRequest
    | ConstraintViolation
    | GraphRequestTimeout
    | DataSourceUnavailable
    | GraphUnreachable
    | InvalidParameter
  > {
    return this.request({
      url: '/{sourceKey}/graph/query',
      method: 'POST',
      body: data,
      path: {sourceKey: dataSourceKey}
    }) as Promise<
      | Success<IGraphQuery>
      | Unauthorized
      | Forbidden
      | BadGraphRequest
      | ConstraintViolation
      | GraphRequestTimeout
      | DataSourceUnavailable
      | GraphUnreachable
      | InvalidParameter
    >;
  }

  /**
   * Update a graph query owned but the current user
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<IGraphQuery>}
   */
  public updateGraphQuery(
    data: {
      id: number;
      name?: string;
      content?: string;
      description?: string;
      sharing?: 'private' | 'source' | 'groups';
      sharedWithGroups?: number[];
    },
    dataSourceKey?: string
  ): Promise<
    | Success<void>
    | Unauthorized
    | Forbidden
    | BadGraphRequest
    | ConstraintViolation
    | GraphRequestTimeout
    | DataSourceUnavailable
    | GraphUnreachable
    | InvalidParameter
  > {
    return this.request({
      url: '/{sourceKey}/graph/query/{id}',
      method: 'PATCH',
      body: data,
      path: {sourceKey: dataSourceKey}
    }) as Promise<
      | Success<void>
      | Unauthorized
      | Forbidden
      | BadGraphRequest
      | ConstraintViolation
      | GraphRequestTimeout
      | DataSourceUnavailable
      | GraphUnreachable
      | InvalidParameter
    >;
  }

  /**
   * Delete a query
   */
  public delete(
    data: {id: number},
    dataSourceKey?: string
  ): Promise<Success<void> | Unauthorized | Forbidden | InvalidParameter | NotFound> {
    return this.request({
      url: '/{sourceKey}/graph/query/{id}',
      method: 'DELETE',
      path: {sourceKey: dataSourceKey},
      body: data
    }) as Promise<Success<void> | Unauthorized | Forbidden | InvalidParameter | NotFound>;
  }
}
