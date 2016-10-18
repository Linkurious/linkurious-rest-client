import { Module } from './Module';
import { IMatch, IMatchAction, IAlert, IMatchResults, IDataSourceRelative } from '../interfaces';
import { Fetcher } from '../http/fetcher';
import * as Query from '../Query';
export declare class AlertModule extends Module {
    /**
     *
     * @param {Fetcher} fetcher
     */
    constructor(fetcher: Fetcher);
    /**
     * get list of alerts
     * @param {IDataSourceRelative} data
     * @returns {Promise<IAlert>}
     */
    getAlerts(data: IDataSourceRelative): Promise<Array<IAlert>>;
    /**
     * get an alert
     * @param {IAlert} data
     * @returns {Promise<IMatch>}
     */
    getAlert(data: Query.IAlert): Promise<IMatch>;
    /**
     * get matches for an alert
     * @param {IFilteredAlert} data
     * @returns {Promise<IMatchResults>}
     */
    getMatches(data: Query.IFilteredAlert): Promise<IMatchResults>;
    /**
     * Do an action on a match
     * @param {IAddActionMatch} data
     * @returns {Promise<boolean>}
     */
    addActionToMatch(data: Query.IAddActionMatch): Promise<boolean>;
    /**
     * get a match
     * @param {IMatch} data
     * @returns {Promise<IMatch>}
     */
    getMatch(data: Query.IMatch): Promise<IMatch>;
    /**
     * get all actions for a match
     * @param {IMatch} data
     * @returns {Promise<IMatchAction>}
     */
    getMatchActions(data: Query.IMatch): Promise<Array<IMatchAction>>;
}
