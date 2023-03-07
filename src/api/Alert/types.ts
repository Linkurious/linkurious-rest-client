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
  SortDirection,
  Tree
} from '../commonTypes';
import {GraphQueryDialect} from '../GraphQuery';
import {LkEdge, LkNode, VizEdge, VizNode} from '../graphItemTypes';
import {User} from '../User';
import {BaseVisualization} from '../Visualization';
import {LkError} from '../../http/response';

export interface IAlertUserInfo extends Pick<User, 'id' | 'username' | 'email'> {
  hasAssignedCases: boolean;
}

export type IBasicUser = Omit<IAlertUserInfo, 'hasAssignedCases'>;

export enum AlertColumnType {
  STRING = 'string',
  NUMBER = 'number'
}

export interface IAlertColumn {
  type: AlertColumnType;
  columnName?: string;
  columnTitle: string;
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

export type ICasesPerAlertAssignmentParam = Pick<IAssignCasesParams, 'alertId' | 'caseIds'>;

export interface IBulkAssignCasesParams extends IDataSourceParams {
  casesPerAlert: ICasesPerAlertAssignmentParam[];
  assignedUserId: number;
}

export interface IGetAlertUsersParams extends IDataSourceParams {
  alertId: number;
}

export interface IUpdateCaseParams extends IDataSourceParams {
  alertId: number;
  caseId: number;
  visualization: BaseVisualization;
}

export interface ICreateAlertParams extends Omit<IBaseAlert, 'folder' | 'queries'> {
  folder?: number;
  queries?: Array<ICreateAlertQueryParams>;
}

export interface ICreateAlertQueryParams extends Omit<IAlertQuery, 'id'> {}

export interface IUpdateAlertQueryParams extends Omit<IAlertQuery, 'id'> {
  id?: number;
}

export interface IBaseAlert extends IDataSourceParams, SharingOptions {
  title: string;
  description?: string;
  queries?: Array<IAlertQuery>;
  folder: number;
  enabled: boolean;
  columns: Array<IAlertColumn>;
  cron: string;
  target?: string; // we assume alerts always have target
  caseAttributesQuery?: string; // query for case attributes
}

export interface Alert extends IBaseAlert, PersistedItem {
  sourceKey: string;
  lastRun?: string; // defined if it has run at least once
  // defined if last run had a problem
  lastRunProblem?: {
    queryId?: number;
    source: 'caseAttributeQuery' | 'alertQuery';
    error: LkError;
    partial: boolean;
  }[];
  nextRun?: string; // defined if enabled=true
  openAndUnAssignedCasesCount: number;
  status: 'running' | 'idle';
}

export interface IAlertQuery {
  id: number;
  query: string;
  name: string;
  description?: string;
  dialect: GraphQueryDialect;
}

export interface IRunAlertParams extends IDataSourceParams {
  id: number;
}

export interface IUpdateAlertParams extends Omit<Partial<ICreateAlertParams>, 'queries'> {
  id: number;
  queries?: Array<IUpdateAlertQueryParams>;
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

export type GetCasesSortBy = CaseListSortBy | ColumnSortBy;

export enum CaseListSortBy {
  DATE = 'date'
}

export enum ColumnSortBy {
  ZERO = '0',
  ONE = '1',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9',
  TEN = '10',
  ELEVEN = '11',
  TWELVE = '12',
  THIRTEEN = '13',
  FOURTEEN = '14',
  FIFTEEN = '15',
  SIXTEEN = '16',
  SEVENTEEN = '17',
  EIGHTEEN = '18',
  NINETEEN = '19',
  TWENTY = '20',
  TWENTY_ONE = '21',
  TWENTY_TWO = '22',
  TWENTY_THREE = '23',
  TWENTY_FOUR = '24',
  TWENTY_FIVE = '25',
  TWENTY_SIX = '26',
  TWENTY_SEVEN = '27',
  TWENTY_EIGHT = '28',
  TWENTY_NINE = '29',
  THIRTY = '30',
  THIRTY_ONE = '31',
  THIRTY_TWO = '32',
  THIRTY_THREE = '33',
  THIRTY_FOUR = '34',
  THIRTY_FIVE = '35',
  THIRTY_SIX = '36',
  THIRTY_SEVEN = '37',
  THIRTY_EIGHT = '38',
  THIRTY_NINE = '39'
}

export interface IExtractCaseListInfoParams extends IDataSourceParams {
  alertId: number;
}

export interface IGetCasesParams extends IDataSourceParams {
  alertId: number;
  offset?: number;
  limit?: number;
  sortDirection?: SortDirection;
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
  columns?: Array<IAlertColumn>;
  limit?: number;
  timeout?: number;
  target?: string;
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

export type FullCaseListSort = FullCaseListSortProperties | ColumnSortBy;

export enum FullCaseListSortProperties {
  CASE_ID = 'id',
  ALERT_NAME = 'alertName',
  ALERT_FOLDER = 'alertFolder',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
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
  updatedAt: Date;
  status: CaseStatus;
  statusChangedBy: Pick<User, 'id' | 'username' | 'email'> | null;
  statusChangedOn: Date | null;
  assignedUser: Pick<User, 'id' | 'username' | 'email'> | null;
  attributes: ICaseColumn[];
}

export interface IFullCaseListResponse {
  totalCasesCount: number;
  fullCaseList: IFullCase[];
}

export type FullCaseListSortBy = {by: FullCaseListSort; direction: SortDirection};

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

export interface IFullCaseListFilters {
  alertIds?: number[];
  caseStatuses?: CaseStatus[];
  assignedUserIds?: number[];
  alertFolderIds?: number[];
}

export interface IFullCaseListPreferences {
  filters: IFullCaseListFilters;
  sortBy: FullCaseListSortBy[];
  offset: number;
}

export interface IGetFullCaseListPreferencesResponse extends IFullCaseListPreferences {
  userId: number;
  sourceKey: string;
}

export interface ISetFullCaseListPreferencesParams
  extends IDataSourceParams,
    IFullCaseListPreferences {}

export const FULL_CASE_LIST_DEFAULT_SORTBY: FullCaseListSortBy = {
  by: FullCaseListSortProperties.CASE_ID,
  direction: SortDirection.DESC
};
