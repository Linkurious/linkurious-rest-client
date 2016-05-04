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

  export function sanitizeQuery(data:any):any {
    if(!data){
      return;
    }
    
    let result = <any>{};

    for(let key in data){
      if(data.hasOwnProperty(key)){
        let sanitizedKey:string;

        sanitizedKey = key.replace(/([A-Z])/g, (char) => '_' + char.toLowerCase());

        result[sanitizedKey] = data[key];
      }
    }
    return result;
  }
}