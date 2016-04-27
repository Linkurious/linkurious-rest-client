/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-04-25.
 *
 * File:
 * Description :
 */

/// <reference path="./../node_modules/typescript/lib/lib.es6.d.ts" />
/// <reference path="./../typings/main/ambient/node/index.d.ts" />
/// <reference path="./../typings/main/definitions/request/index.d.ts" />

import * as HTTPDriver from './HTTPDriver';
import LogDriver from './logDriver';
import {LinkuriousInterface, clientState, LoggerPlugin, LogDriverInterface} from './interfaces';

class Linkurious implements LinkuriousInterface {

  public host:string;
  public client:clientState;
  public log:LogDriverInterface;

  constructor(host:string, log:string, logger?:LoggerPlugin) {
    this.host   = host + '/api/';
    this.client = <clientState>{};

    this.log = <LogDriverInterface>new LogDriver(log, logger);
  }

  public login(userLogin:string, password:string):Promise<any> {

    let data = {
      usernameOrEmail: userLogin,
      password       : password
    };

    return HTTPDriver.POST(this.host + 'auth/login', data)
      .then(res => {
        this.client.user = res.user;
        return new Promise((resolve:Function):Promise<boolean> => resolve(true));
      })
      .catch(res => {
        this.log.error({
          key    : res.status + ' - ' + res.type,
          message: res.message
        });
      })
  }
}

export = Linkurious;