/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-04-28.
 *
 * File:
 * Description :
 */
'use strict';

export namespace Utils {

  export function fixCase(data:any):any {
    if(!data){
      return null;
    }
    
    let result = <any>{};

    for(let key in data){
      if(data.hasOwnProperty(key)){
        let sanitizedKey:string;

        sanitizedKey = key.replace(/([a-zA-Z0-9])([A-Z])/g, (substr, p1, p2) => p1 + '_' + p2.toLowerCase());

        result[sanitizedKey] = data[key];
      }
    }
    return result;
  }
}