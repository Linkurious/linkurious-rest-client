/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

import {IDataSourceParams, PersistedItem} from '../commonTypes';

// TODO: Update access rights after PKAR id merged

export interface UserPreferences {
  pinOnDrag: boolean;
  locale: string;
  incrementalLayout: boolean;
}

export interface User extends PersistedItem {
  username: string;
  email: string;
  groups: GroupName[];
  source: string;
  preferences: UserPreferences;
  actions: string[];
  accessRights: any;
}

export type SimpleUser = Pick<User, 'id' | 'username' | 'email'>;

export interface IGetUserParams {
  id: number;
}

export interface ISearchUsersParams {
  startsWith?: string;
  contains?: string;
  groupId?: number;
  offset?: number;
  limit?: number;
  sortBy?: 'id' | 'username' | 'email';
  sortDirection?: 'asc' | 'desc';
}

export interface SearchUserResponse {
  // TODO type this
}

export interface ICreateUserParams {
  username: string;
  email: string;
  password: string;
  groups?: number[];
}

export interface IUpdateUserParams {
  id: number;
  username?: string;
  email?: string;
  password?: string;
  preferences?: Partial<UserPreferences>;
  addedGroups?: number[];
  removedGroups?: number[];
}

export interface IDeleteUserParams {
  id: number;
}

export interface IGetGroupParams extends IDataSourceParams {
  id: number;
}

export interface AccessRight {
  type: 'read' | 'write' | 'none' | 'do';
  targetType: string;
  targetName: string;
}

export interface Group extends PersistedItem {
  name: string;
  sourceKey: string;
  builtin: boolean;
  userCount?: number;
  accessRights?: AccessRight[];
}

export type GroupName = Pick<Group, 'id' | 'name'>;

export interface IGetGroupsParams extends IDataSourceParams {
  withAccessRights: boolean;
}

export interface IGetGroupNamesParams extends IDataSourceParams {
  // TODO type when we merge PKAR
  action: string;
}

export interface ICreateGroupParams extends IDataSourceParams {
  name: string;
}

export interface IUpdateGroupParams extends IDataSourceParams {
  id: string;
  name: string;
}

export interface IDeleteGroupParams extends IDataSourceParams {
  id: number;
}

export interface ISetAccessRightsParams extends IDataSourceParams {
  id: number;
  accessRights: Array<AccessRight>;
}

export interface IMergeVisualizationsParams {
  from: number;
  to: number;
}

// TODO remove this
// export interface FullUser extends User {
//   preferences: {
//     pinOnDrag: boolean;
//     incrementalLayout: boolean;
//     locale: string;
//   };
//   actions: any;
//   accessRights: any;
// }
//
// // GROUP
// export interface BaseGroup {
//   id: number;
//   name: string;
// }
//
// export interface SimpleGroup extends BaseGroup {
//   builtin: boolean;
//   createdAt: string;
//   updatedAt: string;
// }
//
// export interface Group extends SimpleGroup {
//   userCount?: number;
//   accessRights?: AccessRight[];
//   sourceKey: string;
// }
//
// export type RightType = 'read' | 'write' | 'none' | 'do';
//
// export interface AccessRight {
//   type: RightType;
//   targetType: string;
//   targetName: string;
// }
//
// export interface UserGroup {
//   name: string;
//   builtin: boolean;
//   createdAt: string;
//   updatedAt: string;
// }
//
// export interface SystemGroup extends UserGroup {
//   userCount?: number;
//   accessRights?: AccessRight[];
//   sourceKey: string;
// }
//
// export interface CreateUserResponse {
//   id: number;
//   username: string;
//   email: string;
//   groups: UserGroup[];
//   source: 'string';
//   admin?: boolean;
//   preferences: {
//     pinOnDrag: boolean;
//     incrementalLayout: boolean;
//     locale: string;
//   };
//   actions: any;
//   locale: string;
// }
//
// export interface GroupRights {
//   types: string[];
//   targetTypes: string[];
//   actions: string[];
// }
//
// export interface UpdateUserResponse {
//   id: number;
//   createdAt: string;
//   updatedAt: string;
//   username: string;
//   email: string;
//   groups: SimpleGroup[];
//   source: string;
//   preferences: UserPreferences;
//   actions: any;
//   accessRights: any;
// }
