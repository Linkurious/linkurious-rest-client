/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {
  IDataSourceParams,
  IGetSubGraphParams,
  PersistedItem,
  SharingOptions,
  Tree
} from '../commonTypes';
import {GraphQueryDialect} from '../GraphQuery';
import {LkEdge, LkNode, VizEdge, VizNode} from '../graphItemTypes';
import {User} from '../User';
import {BaseVisualization} from '../Visualization';

export interface IAlertUserInfo extends Pick<User, 'id' | 'username' | 'email'> {
  hasAssignedCases: boolean;
}

export type IBasicUser = Omit<IAlertUserInfo, 'hasAssignedCases'>;

export enum AlertColumnType {
  STRING = 'string',
  NUMBER = 'number'
}

export interface IPopulatedCaseVisualization extends BaseVisualization {
  nodes: VizNode[];
  edges: VizEdge[];
}

export interface IAssignCasesParams extends IDataSourceParams {
  alertId: number;
  caseIds: number[];
  userId: number;
}

export interface IGetAlertUsersParams extends IDataSourceParams {
  alertId: number;
}

export interface IUpdateCaseParams extends IDataSourceParams {
  alertId: number;
  caseId: number;
  visualization: BaseVisualization;
}

export interface ICreateAlertParams extends Omit<IBaseAlert, 'folder'> {
  folder?: number;
}

export interface IBaseAlert extends IDataSourceParams, SharingOptions {
  title: string;
  description?: string;
  query: string;
  dialect: GraphQueryDialect;
  folder: number;
  enabled: boolean;
  columns: Array<{
    type: AlertColumnType;
    columnName: string;
    columnTitle: string;
  }>;
  cron: string;
  target: string; // we assume alerts always have target
}

export interface Alert extends IBaseAlert, PersistedItem {
  sourceKey: string;
  lastRun?: string; // defined if it has run at least once
  lastRunProblem?: {
    // defined if last run had a problem
    error: string;
    partial: boolean;
  };
  nextRun?: string; // defined if enabled=true
  openAndUnAssignedCasesCount: number;
}

export interface IRunAlertParams extends IDataSourceParams {
  id: number;
}

export interface IUpdateAlertParams extends Partial<ICreateAlertParams> {
  id: number;
}

export interface IDeleteAlertParams extends IDataSourceParams {
  id: number;
}

export interface ICreateAlertFolderParams extends IDataSourceParams {
  title: string;
}

export interface AlertFolder extends PersistedItem {
  title: string;
  parent: number;
  sourceKey: string;
}

export interface IUpdateAlertFolderParams extends IDataSourceParams {
  id: number;
  title: string;
}

export interface IDeleteAlertFolderParams extends IDataSourceParams {
  id: number;
}

export type AlertTree = Tree<Alert, 'alert'>;

export interface IGetAlertParams extends IDataSourceParams {
  id: number;
}

export interface IGetCaseParams extends IGetSubGraphParams {
  alertId: number;
  caseId: number;
}

export enum CaseStatus {
  UNCONFIRMED = 'unconfirmed',
  CONFIRMED = 'confirmed',
  DISMISSED = 'dismissed',
  IN_PROGRESS = 'in-progress'
}

export interface PopulatedCase extends Case {
  visualization: IPopulatedCaseVisualization;
}

export interface Case extends PersistedItem {
  sourceKey: string;
  alertId: number;
  hash: string;
  status: CaseStatus;
  statusUpdateDate?: string; // undefined if the case status was never updated
  user?: Pick<User, 'id' | 'username' | 'email'>; // undefined if the case status was never updated
  assignedUser?: Pick<User, 'id' | 'username' | 'email'>; // undefined if the case is currently not assigned to any user
  viewers: Array<{
    id: number;
    username: string;
    email: string;
    date: string;
  }>;
  nodes: string[];
  edges: string[];
  columns: (string | number | null)[]; // An empty column field is filled with null
}

export interface GetCasesResponse {
  counts: {
    unconfirmed: number;
    confirmed: number;
    dismissed: number;
    'in-progress': number;
  };
  cases: Case[];
}

export enum GetCasesSortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export enum GetCasesSortBy {
  DATE = 'date',
  ZERO = '0',
  ONE = '1',
  TWO = '2',
  THREE = '3',
  FOUR = '4'
}

export interface IExtractCaseListInfoParams extends IDataSourceParams {
  alertId: number;
}

export interface IGetCasesParams extends IDataSourceParams {
  alertId: number;
  offset?: number;
  limit?: number;
  sortDirection?: GetCasesSortDirection;
  sortBy?: GetCasesSortBy;
  status?: CaseStatus;
  assignedUserId?: number;
}

export interface IGetCaseActionsParams extends IDataSourceParams {
  alertId: number;
  caseId: number;
  offset?: number;
  limit?: number;
  action?: CaseActionType[];
}

export interface IDeleteCaseCommentParams extends IDataSourceParams {
  commentId: number;
}

export interface IGetCaseActionsResponse {
  total: number;
  caseActions: CaseAction[];
}

export enum CaseActionType {
  CONFIRM = 'confirm',
  DISMISS = 'dismiss',
  UNCONFIRM = 'unconfirm',
  OPEN = 'open',
  COMMENT = 'comment',
  IN_PROGRESS = 'in-progress',
  ASSIGN = 'assign'
}

export interface CaseAction extends PersistedItem {
  caseId: number;
  user: Pick<User, 'id' | 'username' | 'email'>;
  action: CaseActionType;
  comment?: string;
  assignedUser?: Pick<User, 'id' | 'username' | 'email'>;
}

export interface IDoCaseActionParams extends IDataSourceParams {
  alertId: number;
  caseId: number;
  action: CaseActionType;
  comment?: string;
}

export interface IAlertPreviewParams extends IDataSourceParams {
  query: string;
  dialect?: GraphQueryDialect;
  columns?: Array<{columnName: string; columnTitle?: string; type: AlertColumnType}>;
  limit?: number;
  timeout?: number;
  target: string;
}

export type AlertPreview = Array<{
  nodes: LkNode[];
  edges: LkEdge[];
  columns: Array<string | number>;
}>;

export interface ICaseColumn {
  type: AlertColumnType;
  columnValue: string | number | null;
  columnTitle: string;
}

export enum FullCaseListSortProperties {
  CASE_ID = 'id',
  ALERT_NAME = 'alertName',
  ALERT_FOLDER = 'alertFolder',
  CREATED_AT = 'createdAt',
  STATUS = 'status',
  STATUS_CHANGED_BY = 'statusChangedBy',
  STATUS_CHANGED_ON = 'statusChangedOn',
  ASSIGNEE = 'assignedUser'
}

export interface IFullCase {
  id: number;
  alertName: string;
  alertId: number;
  alertFolder: string | null;
  alertDescription: string | null;
  createdAt: Date;
  status: CaseStatus;
  statusChangedBy: Pick<User, 'id' | 'username' | 'email'> | null;
  statusChangedOn: Date | null;
  assignedUser: Pick<User, 'id' | 'username' | 'email'> | null;
}

export interface IFullCaseListResponse {
  totalCasesCount: number;
  fullCaseList: IFullCase[];
}

export type FullCaseListSortBy = {by: FullCaseListSortProperties; direction: GetCasesSortDirection};

export interface IGetFullCaseListParams extends IDataSourceParams {
  offset?: number;
  limit?: number;
  alertIdsFilter?: number[];
  caseStatusesFilter?: CaseStatus[];
  assignedUserIdsFilter?: number[];
  sortBy: FullCaseListSortBy[];
}

export interface ICasePreview extends Omit<IFullCase, 'statusChangedOn' | 'statusChangedBy'> {
  attributes: ICaseColumn[];
  commentsCount: number | null;
  lastCommentDate: Date | null;
}

export interface IGetAllAlertUsersParams extends IDataSourceParams {
  mutualAlertIds?: number[];
}

export interface IFullCasesBulkAssignmentParams extends IDataSourceParams {
  casesPerAlert: Map<number, number[]>;
  assignedUserId: number;
}
