/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-11-22.
 *
 * File:
 * Description :
 */
'use strict';

import { Fetcher } from './fetcher';
import { Logger } from '../log/Logger';
import { IClientState } from '../../index';

export class FetcherFactory {
  public create(_logger: Logger, _clientState: IClientState, baseUrl: string): Fetcher {
    return new Fetcher(_logger, _clientState, baseUrl);
  }
}
