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

import { IEdge, IFullNode, INode, IOgmaEdge, IOgmaNode } from '../../index';
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
   * Run a static or template query
   */
  public runQuery(
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
    | Success<{ nodes: Array<IOgmaNode>; edges: Array<IOgmaEdge> }>
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
      url: '/{dataSourceKey}/graph/runQuery',
      method: 'POST',
      body: body,
      query: query,
      dataSource: dataSourceKey,
    })
      .then((response: { nodes: Array<INode>; edges: Array<IEdge> }) => {
        return new Success({
          nodes: response.nodes.map((n: INode) => VisualizationParser.parseNode(n)),
          edges: response.edges.map((e: IEdge) => VisualizationParser.parseEdge(e)),
        });
      })
      .catch((error) => new ServerRejection(error));
  }

  /**
   * Return resolve if the current query is valid
   */
  public checkQuery(
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
      url: '/{dataSourceKey}/graph/checkQuery',
      method: 'POST',
      body: data,
      dataSource: dataSourceKey,
    })
      .then(() => new Success(undefined))
      .catch((error) => new ServerRejection(error));
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
}
