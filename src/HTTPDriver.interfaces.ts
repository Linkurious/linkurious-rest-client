export interface HTTPDriverInterface {
  POST(uri:string, data:any):Promise<any>;
  PUT(uri:string, data:any):Promise<any>;
  PATCH(uri:string, data:any):Promise<any>;
  GET(uri:string, data?:any):Promise<any>;
  DELETE(uri:string):Promise<any>;
}


