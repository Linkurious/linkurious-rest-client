/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {
  CommentMention,
  DeletableUser,
  ICurrencyOptions,
  IDataSourceParams,
  IGetSubGraphParams,
  PersistedItem,
  SharingOptions,
  SortDirection
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
  columnTitle: string;
  columnName?: string;
  currencyOptions?: ICurrencyOptions;
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

export interface AssignFilteredCasesParams extends IDataSourceParams {
  filters: FullCaseListFilterParams;
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

export interface ICreateAlertParams
  extends Omit<IBaseAlert, 'folder' | 'preprocessingSteps' | 'queries'> {
  uuid?: string;
  folder?: number;
  preprocessingSteps?: Array<CreateAlertPreprocessingStepParams>;
  queries?: Array<ICreateAlertQueryParams>;
}

export interface CreateAlertPreprocessingStepParams extends Omit<AlertPreprocessingStep, 'uuid'> {
  uuid?: string;
}

export interface ICreateAlertQueryParams
  extends Pick<IAlertQuery, 'query' | 'name' | 'description' | 'dialect'> {
  uuid?: string;
}

export interface UpdateAlertPreprocessingStepParams extends Omit<AlertPreprocessingStep, 'uuid'> {
  uuid?: string;
}

export interface IUpdateAlertQueryParams extends ICreateAlertQueryParams {
  id?: number;
  operation: AlertQueryUpdateOperation;
}

export enum AlertQueryUpdateOperation {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete'
}

export interface IBaseAlert extends IDataSourceParams, SharingOptions {
  title: string;
  description?: string;
  preprocessingSteps?: Array<AlertPreprocessingStep>;
  queries?: Array<IAlertQuery>;
  folder: number;
  enabled: boolean;
  columns: Array<IAlertColumn>;
  cron: string;
  target?: string; // we assume alerts always have target
  caseAttributesQuery?: string; // query for case-attributes
  caseAttributesQueryDialect?: GraphQueryDialect; // case-attributes query dialect
}

export interface Alert extends IBaseAlert, PersistedItem {
  uuid: string;
  sourceKey: string;
  lastRun?: string; // defined if it has run at least once
  // defined if last run had a problem
  lastRunProblem?: AlertError[];
  nextRun?: string; // defined if enabled=true
  openAndUnAssignedCasesCount: number;
  status: 'running' | 'idle';
  resultsConsistent: boolean;
  owner: DeletableUser;
  lastEditor: DeletableUser;
  lastShareEditor: DeletableUser;
}

export interface AlertPreprocessingStep
  extends Pick<IAlertQuery, 'query' | 'name' | 'description' | 'dialect'> {
  // Unique identifier for the preprocessing step since we can have multiple steps with the same name and/or query
  uuid: string;
}

export interface IAlertQuery extends AlertQueryData {
  uuid: string;
  query: string;
  dialect: GraphQueryDialect;
  updatedAt: Date;
}

export interface BaseAlertError {
  source: 'caseAttributeQuery' | 'alertQuery' | 'preprocessingStep';
  error: LkError;
  partial: boolean;
}

export interface AlertQueryError extends BaseAlertError {
  queryId: number;
  source: 'alertQuery';
}

export interface AlertPreprocessingStepError extends BaseAlertError {
  // preprocessingStepUuid is defined if the error is related to an individual preprocessing step
  // (ex. if the data source is in read only mode we return one preprocessing step error with the uuid)
  preprocessingStepUuid?: string;
  source: 'preprocessingStep';
}

export interface AlertCaseAttributeQueryError extends BaseAlertError {
  source: 'caseAttributeQuery';
}
export type AlertError =
  | AlertQueryError
  | AlertPreprocessingStepError
  | AlertCaseAttributeQueryError;

export interface IRunAlertParams extends IDataSourceParams {
  id: number;
  waitForRun?: boolean;
}
export interface RunAlertResponse {
  alreadyRunning: boolean;
}

export interface IUpdateAlertParams
  extends Omit<Partial<ICreateAlertParams>, 'uuid' | 'preprocessingSteps' | 'queries'> {
  id: number;
  preprocessingSteps?: Array<UpdateAlertPreprocessingStepParams>;
  queries?: Array<IUpdateAlertQueryParams>;
}

export interface IDeleteAlertParams extends IDataSourceParams {
  id: number;
}

export interface ICreateAlertFolderParams extends IDataSourceParams {
  uuid?: string;
  title: string;
}

export interface AlertFolder extends PersistedItem {
  uuid: string;
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

export interface AlertTree extends AlertTreeFolder {
  id: -1;
  title: 'root';
}

export type AlertTreeFolder = Pick<AlertFolder, 'id' | 'uuid' | 'title'> & {
  type: 'folder';
  children: Array<AlertTreeFolder | AlertTreeItem>;
};

export type AlertTreeItem = Alert & {type: 'alert'};

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

export interface CaseForCaseList extends Case {
  alertQueries: AlertQueryData[];
}

export interface GetCasesResponse {
  counts: {
    unconfirmed: number;
    confirmed: number;
    dismissed: number;
    'in-progress': number;
  };
  cases: CaseForCaseList[];
}

export type GetCasesSortBy = CaseListSortBy | ColumnSortAndFilterBy;

export enum CaseListSortBy {
  DATE = 'date'
}

export enum ColumnSortAndFilterBy {
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
  metadata?: CaseActionMetadata;
  assignedUser?: Pick<User, 'id' | 'username' | 'email'>;
}

export interface CaseActionMetadata {
  mentions: CommentMention[];
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
  currencyOptions?: ICurrencyOptions;
}

export interface AlertQueryData {
  id: number;
  modelKey: string;
  name: string;
  description?: string;
  deleted: boolean;
}
export type FullCaseListSort = FullCaseListSortProperties | ColumnSortAndFilterBy;

export enum FullCaseListSortProperties {
  CASE_ID = 'id',
  ALERT_NAME = 'alertName',
  ALERT_FOLDER = 'alertFolder',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  STATUS = 'status',
  STATUS_CHANGED_BY = 'statusChangedBy',
  STATUS_CHANGED_ON = 'statusChangedOn',
  ASSIGNEE = 'assignedUser',
  ALERT_QUERIES_COUNT = 'alertQueriesCount'
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
  alertQueries: AlertQueryData[];
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
  caseColumnsFilter?: CaseColumnFilter[];
  alertQueryModelKeysFilter?: string[];
  dateFilter?: FullCaseListDateFilter;
  sortBy: FullCaseListSortBy[];
}

export interface FullCaseListFilterParams
  extends Pick<
    IGetFullCaseListParams,
    | 'alertIdsFilter'
    | 'caseStatusesFilter'
    | 'assignedUserIdsFilter'
    | 'caseColumnsFilter'
    | 'alertQueryModelKeysFilter'
    | 'dateFilter'
  > {}

export interface FullCaseListDateFilter {
  filterBy: 'createdAt' | 'updatedAt';

  // start and end dates are in ISO format
  startDate?: string;
  endDate?: string;
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
  caseColumns?: CaseColumnFilter[];
  dateFilter?: FullCaseListDateFilter;
  alertQueryModelKeys?: string[];
}

export interface CaseColumnFilter {
  index: ColumnSortAndFilterBy;
  value: string | string[] | number | CaseColumnRangeFilter;
}

export interface CaseColumnRangeFilter {
  min: number;
  max: number;
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

export interface SearchColumnValuesForAlertCases {
  alertId: number;
  columnStringIndex: number;
  searchValue: string;
  excludedValues?: string[];
  limit?: number;
  format?: (typeof SEARCH_COLUMNS_RESULT_FORMAT)[number];
}

export const SEARCH_COLUMNS_RESULT_FORMAT = ['list', 'paginated'] as const;
