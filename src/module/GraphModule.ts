/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-05-30.
 *
 * File:
 * Description :
 */

'use strict';

import { IEdge, IGraphQuery, INode, IOgmaEdge, IOgmaNode } from '../../index';
import { Module } from './Module';
import { Fetcher } from '../http/fetcher';
import { VisualizationParser } from './VisualizationParser';
import { Success } from '../response/success';
import {
  BadGraphRequest,
  ConstraintViolation,
  DataSourceUnavailable,
  Forbidden,
  GraphRequestTimeout,
  GraphUnreachable,
  GuestDisabled,
  InvalidParameter,
  ServerRejection,
  Unauthorized,
} from '../response/errors';

export class GraphModule extends Module {
  constructor(fetcher: Fetcher) {
    super(fetcher);
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
    return this.fetch({
      url: '/{dataSourceKey}/graph/query/{id}',
      method: 'GET',
      query: data,
      dataSource: dataSourceKey,
    })
      .then((response: IGraphQuery) => {
        return new Success(response);
      })
      .catch(
        (error) =>
          new ServerRejection(error) as
            | Unauthorized
            | GuestDisabled
            | Forbidden
            | BadGraphRequest
            | ConstraintViolation
            | GraphRequestTimeout
            | DataSourceUnavailable
            | GraphUnreachable
            | InvalidParameter
      );
  }

  /**
   * Returns all saved GraphModule Queries owned by the current user
   *
   * @param {{ type:'static'|'template'}} data
   * @param {string} dataSourceKey
   * @returns {Promise<Array<IGraphQuery>>}
   */
  public getAllGraphQueries(
    data: { type: 'static' | 'template' },
    dataSourceKey?: string
  ): Promise<
    | Success<Array<IGraphQuery>>
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
    return this.fetch({
      url: '/{dataSourceKey}/graph/query',
      method: 'GET',
      dataSource: dataSourceKey,
      query: data,
    })
      .then((response: Array<IGraphQuery>) => {
        return new Success(response);
      })
      .catch(
        (error) =>
          new ServerRejection(error) as
            | Unauthorized
            | GuestDisabled
            | Forbidden
            | BadGraphRequest
            | ConstraintViolation
            | GraphRequestTimeout
            | DataSourceUnavailable
            | GraphUnreachable
            | InvalidParameter
      );
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
        nodes: Array<IOgmaNode>;
        edges: Array<IOgmaEdge>;
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
    let body: any = {
      dialect: data.dialect,
      query: data.query,
      limit: data.limit,
      timeout: data.timeout,
      templateData: data.templateData,
    };
    let query: any = {
      withDigest: data.withDigest,
      withDegree: data.withDegree,
      withAccess: data.withAccess,
    };
    return this.fetch({
      url: '/{dataSourceKey}/graph/run/query',
      method: 'POST',
      body: body,
      query: query,
      dataSource: dataSourceKey,
    })
      .then(
        (response: {
          nodes: Array<INode>;
          edges: Array<IEdge>;
          truncatedByLimit: boolean;
          truncatedByAccess: boolean;
        }) => {
          return new Success({
            nodes: response.nodes.map((n: INode) => VisualizationParser.parseNode(n)),
            edges: response.edges.map((e: IEdge) => VisualizationParser.parseEdge(e)),
            truncatedByLimit: response.truncatedByLimit,
            truncatedByAccess: response.truncatedByAccess,
          });
        }
      )
      .catch(
        (error) =>
          new ServerRejection(error) as
            | Unauthorized
            | GuestDisabled
            | Forbidden
            | BadGraphRequest
            | ConstraintViolation
            | GraphRequestTimeout
            | DataSourceUnavailable
            | GraphUnreachable
            | InvalidParameter
      );
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
    return this.fetch({
      url: '/{dataSourceKey}/graph/check/query',
      method: 'POST',
      body: data,
      dataSource: dataSourceKey,
    })
      .then(() => new Success(undefined))
      .catch(
        (error) =>
          new ServerRejection(error) as
            | Unauthorized
            | Forbidden
            | BadGraphRequest
            | ConstraintViolation
            | GraphRequestTimeout
            | DataSourceUnavailable
            | GraphUnreachable
            | InvalidParameter
      );
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
      withAccess?: boolean;
      withDegree?: boolean;
      withDigest?: boolean;
      columns?: any;
    },
    dataSourceKey?: string
  ): Promise<Array<{ nodes: Array<IOgmaNode>; edges: Array<IOgmaEdge>; columns: any }>> {
    let query: any = {
      withAccess: data.withAccess,
      withDegree: data.withDegree,
      withDigest: data.withDigest,
    };
    let body: any = {
      query: data.query,
      dialect: data.dialect,
      limit: data.limit,
      timeout: data.timeout,
      columns: data.columns,
    };
    return this.fetch({
      url: '/{dataSourceKey}/graph/alertPreview',
      method: 'POST',
      body: body,
      query: query,
      dataSource: dataSourceKey,
    }).then((response) => {
      return response.results.map((result: any) => {
        return {
          nodes: result.nodes.map((n: INode) => VisualizationParser.parseNode(n)),
          edges: result.edges.map((e: IEdge) => VisualizationParser.parseEdge(e)),
          columns: result.columns,
        };
      });
    });
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
      sharedWithGroups?: Array<number>;
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
    return this.fetch({
      url: '/{dataSourceKey}/graph/query',
      method: 'POST',
      body: data,
      dataSource: dataSourceKey,
    })
      .then((response: IGraphQuery) => {
        return new Success(response);
      })
      .catch(
        (error) =>
          new ServerRejection(error) as
            | Unauthorized
            | Forbidden
            | BadGraphRequest
            | ConstraintViolation
            | GraphRequestTimeout
            | DataSourceUnavailable
            | GraphUnreachable
            | InvalidParameter
      );
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
      sharedWithGroups?: Array<number>;
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
    return this.fetch({
      url: '/{dataSourceKey}/graph/query/{id}',
      method: 'PATCH',
      body: data,
      dataSource: dataSourceKey,
    })
      .then(() => new Success(undefined))
      .catch(
        (error) =>
          new ServerRejection(error) as
            | Unauthorized
            | Forbidden
            | BadGraphRequest
            | ConstraintViolation
            | GraphRequestTimeout
            | DataSourceUnavailable
            | GraphUnreachable
            | InvalidParameter
      );
  }
}
