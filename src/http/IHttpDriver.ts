/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by david on 2016-05-27.
 *
 * File:
 * Description :
 */
'use strict';

import {IHttpResponse} from './IHttpResponse';

export interface IHttpDriver {
  POST(uri:string, data?:any):Promise<IHttpResponse>;
  PUT(uri:string, data:any):Promise<IHttpResponse>;
  PATCH(uri:string, data:any):Promise<IHttpResponse>;
  GET(uri:string, data?:any):Promise<IHttpResponse>;
  DELETE(uri:string, data?:any):Promise<IHttpResponse>;
}
