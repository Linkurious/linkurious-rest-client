/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2024
 *
 * Created on 2024-10-25
 */

import {EntityType} from '../GraphSchema';

/**
 * @example
 * Query:
 * Find companies called Linkurious with more than two employees working in CDI and called John.
 *
 * Formal query:
 * - Companies with any property matching "Linkurious"
 * - connected via a "HAS_EMPLOYEE" edge with property `contract` = "CDI"
 * - to at least 2 nodes of type "Person" with property `name` = "John"
 * - limit to 100 results
 *
 * Code:
 * ```ts
 * const example: StructuredGraphQuery = {
 *   traversal: {
 *     firstStep: {
 *       entityType: 'node',
 *       filterType: 'search',
 *       fuzziness: 0.2,
 *       itemType: ['Company'],
 *       limit: 1000,
 *       propertyFilters: [
 *         {
 *           propertyKey: null,
 *           propertyType: 'string',
 *           operator: '~',
 *           input: {type: 'value', value: 'Linkurious'}
 *         }
 *       ]
 *     },
 *     otherSteps: [
 *       {
 *         edgeFilter: {
 *           entityType: 'edge',
 *           filterType: 'strict',
 *           direction: undefined,
 *           itemType: ['HAS_EMPLOYEE'],
 *           propertyFilters: [
 *             {
 *               propertyType: 'string',
 *               propertyKey: 'contract',
 *               operator: '=',
 *               input: {type: 'value', value: ['CDI']}
 *             }
 *           ]
 *         },
 *         nodeFilter: {
 *           entityType: 'node',
 *           filterType: 'strict',
 *           itemType: ['Person'],
 *           propertyFilters: [
 *             {
 *               propertyType: 'string',
 *               propertyKey: 'name',
 *               operator: '=',
 *               input: {type: 'value', value: ['John']}
 *             }
 *           ]
 *         },
 *         // the Company must have at least 2 employees named John
 *         minCardinality: 2
 *       }
 *     ]
 *   },
 *   limit: 100
 * }
 * ```
 */
export interface StructuredGraphQuery {
  traversal: StructuredGraphQueryTraversal;
  // max number of results for the query
  limit: number;
}

export interface StructuredGraphQueryTraversal {
  firstStep: GraphQueryNodeSearchFilter | GraphQueryNodeStrictFilter;
  // otherSteps can be an empty array, in which case we only match nodes from the first step
  otherSteps: Array<StructuredQueryStep>;
}

export interface StructuredQueryStep {
  /**
   * Defining the node filter is optional.
   * It is used to restrict which nodes will be included in this traversal step.
   * Leaving the nodeFilter undefined means this step will match any node.
   */
  nodeFilter?: GraphQueryNodeStrictFilter;
  /**
   * The edge filter is optional.
   * It is used to restrict the edges that can be traversed to go from the previous node to
   * nodes matched in this traversal step.
   * Leaving the edgeFilter undefined means that this step will match any edge in any direction.
   */
  edgeFilter?: GraphQueryEdgeFilter;
  minCardinality?: number;
  maxCardinality?: number;
}

/**
 * Internal base interface for a node or edge filter.
 */
export interface BaseGraphQueryFilter {
  entityType: EntityType;
  filterType: 'strict' | 'search';
  propertyFilters: BasePropertyFilter[];
}

/**
 * Public strict node filter (executed via graph database).
 * It represents a filter for node-categories + some property criteria.
 * To match "any node category", leave `itemType` empty.
 * To match "any node property", leave `propertyFilters` empty.
 */
export interface GraphQueryNodeStrictFilter extends BaseGraphQueryFilter {
  entityType: EntityType.NODE;
  filterType: 'strict';
  itemType: string[];
  propertyFilters: StrictPropertyFilter[];
}

/**
 * Search filter (executed via search engine)
 * - node-category: must match `itemType` (`null` means *any category*).
 * - properties: must match all filters in `propertyFilters`.
 * - fuzziness: all string property filters are executed with `fuzziness`.
 * - limit: only the `limit` best results are returned by the search engine.
 */
export interface GraphQueryNodeSearchFilter extends BaseGraphQueryFilter {
  entityType: EntityType.NODE;
  // null means "any node type"
  itemType: string | null;
  filterType: 'search';
  propertyFilters: SearchPropertyFilter[];
  fuzziness: number;
  limit: number;
}

/**
 * Edge filter (executed via graph database):
 * - edge-type: must one of `itemType` (empty mean "any edge type").
 * - direction: must respect `direction`
 * - properties: must match all filters in `propertyFilters`.
 */
export interface GraphQueryEdgeFilter {
  entityType: EntityType.EDGE;
  filterType: 'strict';
  // direction=undefined means we will match edges in both directions
  direction?: 'fromPrevious' | 'toPrevious';
  itemType: string[];
  propertyFilters: StrictPropertyFilter[];
}

/**
 * Internal interface for property filters
 */
export interface BasePropertyFilter {
  propertyType: 'string' | 'number' | 'date' | 'dateTime';
  operator: BaseOperator;
}

/**
 * Search property filters (executed via search engine):
 * - string filter (fuzziness applies)
 * - numerical filter (only supported when the search vendor is Elasticsearch)
 */
export type SearchPropertyFilter = NumberSearchPropertyFilter | StringSearchPropertyFilter;

export interface BaseSearchPropertyFilter extends BasePropertyFilter {
  // null means "any property"
  propertyKey: string | null;
}

// these property filters are only supported with Elasticsearch
export interface NumberSearchPropertyFilter extends BaseSearchPropertyFilter {
  propertyType: 'number';
  propertyKey: string;
  // "number" search property filters cannot use the "fuzzy match" ("~") operator.
  operator: Exclude<BasePropertyFilter['operator'], '~'>;
  input: QueryProperty<number>;
}

// this is the fuzzy string property match that is supported by all search vendors.
export interface StringSearchPropertyFilter extends BaseSearchPropertyFilter {
  propertyType: 'string';
  operator: '~';
  input: QueryProperty<string>;
}

/**
 * Strict property filters (executed via the graph database).
 * Supported filters:
 * - string filter
 * - numerical filter
 */
export type StrictPropertyFilter =
  | StringStrictPropertyFilter
  | NumberStrictPropertyFilter
  | DateStrictPropertyFilter
  | DateTimeStrictPropertyFilter;

export interface BaseStrictPropertyFilter<T> extends BasePropertyFilter {
  propertyKey: string;
  operator: Exclude<BasePropertyFilter['operator'], '~'>;
  input: QueryProperty<T>;
}
export const BASE_OPERATORS = [
  '=',
  '!=',
  '<',
  '<=',
  '>',
  '>=',
  '~',
  'inBetween',
  'isNull',
  'isNotNull'
] as const;
export type BaseOperator = (typeof BASE_OPERATORS)[number];

export const STRING_OPERATORS = ['=', '!=', 'isNull', 'isNotNull'] as const;
export type StringOperator = (typeof STRING_OPERATORS)[number];

export const NUMBER_OPERATORS = ['=', '!=', '<', '<=', '>', '>=', 'isNull', 'isNotNull'] as const;
export type NumberOperator = (typeof NUMBER_OPERATORS)[number];

export const DATE_OPERATORS = [
  '=',
  '!=',
  '<',
  '<=',
  '>',
  '>=',
  'inBetween',
  'isNull',
  'isNotNull'
] as const;

export type DateOperator = (typeof DATE_OPERATORS)[number];

export type InBetweenOperatorInput = {
  startDate: string;
  endDate: string;
};

export interface StringStrictPropertyFilter extends BaseStrictPropertyFilter<string[]> {
  propertyType: 'string';
  operator: StringOperator;
}

export interface BaseDateStrictPropertyFilter
  extends Omit<BaseStrictPropertyFilter<string>, 'input' | 'operator'> {
  propertyType: 'date' | 'dateTime';
  operator: DateOperator;
  input: QueryProperty<string | InBetweenOperatorInput>;
}

export interface InBetweenDateStrictPropertyFilter extends BaseDateStrictPropertyFilter {
  operator: 'inBetween';
  input: QueryProperty<InBetweenOperatorInput>;
}

export interface SingleDateStrictPropertyFilter extends BaseDateStrictPropertyFilter {
  operator: Exclude<DateOperator, 'inBetween'>;
  input: QueryProperty<string>;
}

export type DateStrictPropertyFilter = (
  | SingleDateStrictPropertyFilter
  | InBetweenDateStrictPropertyFilter
) & {
  propertyType: 'date';
};

export type DateTimeStrictPropertyFilter = (
  | SingleDateStrictPropertyFilter
  | InBetweenDateStrictPropertyFilter
) & {
  propertyType: 'dateTime';
};

export interface NumberStrictPropertyFilter extends BaseStrictPropertyFilter<number> {
  propertyType: 'number';
  operator: NumberOperator;
}

export type QueryProperty<T> = QueryPropertyValue<T> | QueryPropertyTemplate;

export interface BaseQueryProperty {
  type: 'value' | 'template';
}

export interface QueryPropertyValue<T> extends BaseQueryProperty {
  type: 'value';
  value: T;
}

export type QueryPropertyTemplate = StringQueryPropertyTemplate | NumberQueryPropertyTemplate;

export interface BaseQueryPropertyTemplate extends BaseQueryProperty {
  type: 'template';
  inputType: 'number' | 'string' | 'date' | 'boolean' | 'dateTime';
}

export interface StringQueryPropertyTemplate extends BaseQueryPropertyTemplate {
  inputType: 'string';
  defaultValue?: string;
  allowedValues?: string[];
}

export interface NumberQueryPropertyTemplate extends BaseQueryPropertyTemplate {
  inputType: 'number';
  defaultValue?: number;
  maxValue?: number;
  minValue?: number;
}
