/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-04-26.
 *
 * File: HTTPDriver.ts
 * Description : Wrapper for HTTP requests + promises
 */
'use strict';

import * as request from 'request';
import * as ErrorsDriver from './errorsDriver';

export function POST(uri:string, data:any):Promise<any> {
  return new Promise((resolve:Function, reject:Function) => {
    request({
      method: 'POST',
      uri   : uri,
      json  : true,
      body  : data
    }, (err, res, body) => {
      if(res.statusCode > 400){
        return reject(ErrorsDriver.format(res, body));
      } else {
        return resolve(body);
      }
    });
  });
}

export function GET(uri:string):Promise<any> {
  return new Promise((resolve:any, reject:any) => {
    request({
      method: 'GET',
      uri   : uri
    }, (err, res, body) => {
      if(res.statusCode > 400){
        return reject(body) ;
      } else {
        return resolve(body);
      }
    });
  });
}

