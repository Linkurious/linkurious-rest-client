/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2016-11-22.
 */

import {IClientState} from '../../index';
import {Logger} from '../log/Logger';
import {Fetcher} from './fetcher';

export class FetcherFactory {
  public create(_logger: Logger, _clientState: IClientState, baseURL: string): Fetcher {
    return new Fetcher(_logger, _clientState, baseURL);
  }
}
