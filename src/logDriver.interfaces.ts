export interface LoggerPlugin {
  debug:Function;
  error:Function;
}

export interface LogDriverInterface {
  level:string;
  logger:LoggerPlugin;
  debug(logBody:ErrorBody):void;
  error(logBody:ErrorBody):void;
}

export interface ErrorBody {
  key:string;
  message:string;
}