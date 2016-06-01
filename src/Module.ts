/**
 * Created by david on 01/06/16.
 */
'use strict';

import Fetcher from "./fetcher";
import {FetchConfig} from "./interfaces";

export default class Module {
  private _fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this._fetcher = fetcher;
  }

  protected fetch(config: FetchConfig) {
    return this._fetcher.fetch(config);
  }
}

