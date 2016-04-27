/*
* user model
*/
export interface user {
  id:number;
  username:string;
  email:string;
  groups:any;
  admin:boolean;
  preferences:any;
  actions:any;
}

/*
 * current source model
 */
export interface currentSource {
  name:string;
  key:string;
  configIndex:number;
}

/*
 * global REST client model
 */
export interface clientState {
  user:user;
  currentSource:currentSource;
}

/*
 * Linkurious class
 */
export interface LinkuriousInterface {
  host:string;
  client:clientState;
  login(userLogin:string, password:string):Promise<any>;
}

/*
 * log libraries params
 */
export interface LoggerPlugin {
  debug:Function;
  error:Function;
}

/*
 * LogDriver class
 */
export interface LogDriverInterface {
  level:string;
  logger:LoggerPlugin;
  debug(logBody:ErrorBody):void;
  error(logBody:ErrorBody):void;
}

/*
 * server response body
 */
export interface ResponseBody {
  status:number;
  type:string;
  key:string;
  message:string;
}

/*
 * Error model
 */
export interface ErrorBody {
  key:string;
  message:string;
}

