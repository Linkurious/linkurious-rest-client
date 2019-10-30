/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

// TS2019-DONE

import {IDataSourceRelative, RightType, IPersistedItem, IIdentified, IDataSourceParams} from '../commonTypes';

// USER
export interface ISimpleUser extends IPersistedItem {
  username: string;
  email: string;
}

export interface IUser extends ISimpleUser {
  groups: ISimpleGroup[];
  source: string;
}

export interface IFullUser extends IUser {
  preferences: {
    pinOnDrag: boolean;
    incrementalLayout: boolean;
    locale: string;
  };
  actions: any;
  accessRights: any;
}

export interface IGetUserParams extends IDataSourceParams {
  id: number;
}

// GROUP
export interface IBaseGroup extends IIdentified {
  name: string;
}

export interface ISimpleGroup extends IBaseGroup {
  builtin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IGroup extends ISimpleGroup {
  userCount?: number;
  accessRights?: IAccessRight[];
  sourceKey: string;
}

export interface IAccessRight extends IDataSourceRelative {
  type: RightType;
  targetType: string;
  targetName: string;
}

export interface IGroupRights {
  types: string[];
  targetTypes: string[];
  actions: string[];
}
