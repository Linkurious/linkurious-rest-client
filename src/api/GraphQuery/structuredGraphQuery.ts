/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2024
 *
 * Created on 2024-10-25
 */

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
 *       itemType: 'Company',
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
 *           direction: 'both',
 *           itemType: 'HAS_EMPLOYEE',
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
 *           itemType: 'Person',
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
  readonly traversal: {
    readonly firstStep: GraphQueryNodeSearchFilter | GraphQueryNodeStrictFilter;
    // otherSteps can be an empty array, in which case we only match nodes from the first step
    readonly otherSteps: Array<StructuredQueryStep>;
  };
  // max number of results for the query
  readonly limit: number;
}

export interface StructuredQueryStep {
  /**
   * Defining the node filter is optional.
   * It is used to restrict which nodes will be included in this traversal step.
   * Leaving the nodeFilter undefined means this step will match any node.
   */
  readonly nodeFilter?: GraphQueryNodeStrictFilter;
  /**
   * The edge filter is optional.
   * It is used to restrict the edges that can be traversed to go from the previous node to
   * nodes matched in this traversal step.
   * Leaving the edgeFilter undefined means that this step will match any edge in any direction.
   */
  readonly edgeFilter?: GraphQueryEdgeFilter;
  readonly minCardinality?: number;
  readonly maxCardinality?: number;
}

/**
 * Internal base interface for a node or edge filter.
 */
interface BaseGraphQueryFilter {
  readonly entityType: 'node' | 'edge';
  readonly filterType: 'strict' | 'search';
  readonly propertyFilters: BasePropertyFilter[];
}

/**
 * Public strict node filter (executed via graph database).
 * It represents a filter for *one* node-category + some property criteria.
 * Note: to match "any node" in a step, leave {@link StructuredQueryStep.nodeFilter} undefined.
 */
export interface GraphQueryNodeStrictFilter extends BaseGraphQueryFilter {
  readonly entityType: 'node';
  readonly filterType: 'strict';
  readonly itemType: string;
  readonly propertyFilters: StrictPropertyFilter[];
}

/**
 * Search filter (executed via search engine)
 * - node-category: must match `itemType` (`null` means *any category*).
 * - properties: must match all filters in `propertyFilters`.
 * - fuzziness: all string property filters are executed with `fuzziness`.
 * - limit: only the `limit` best results are returned by the search engine.
 * TODO: implement query generation for this
 */
export interface GraphQueryNodeSearchFilter extends BaseGraphQueryFilter {
  readonly entityType: 'node';
  // null means "any node type"
  readonly itemType: string | null;
  readonly filterType: 'search';
  readonly propertyFilters: SearchPropertyFilter[];
  readonly fuzziness: number;
  readonly limit: number;
}

/**
 * Edge filter (executed via graph database):
 * - edge-type: must be `itemType`.
 * - direction: must respect `direction`
 * - properties: must match all filters in `propertyFilters`.
 */
export interface GraphQueryEdgeFilter {
  readonly entityType: 'edge';
  readonly filterType: 'strict';
  readonly direction?: 'fromPrevious' | 'toPrevious';
  readonly itemType: string;
  readonly propertyFilters: StrictPropertyFilter[];
}

/**
 * Internal interface for property filters
 */
interface BasePropertyFilter {
  readonly propertyType: 'string' | 'number' | 'date';
  readonly operator: '=' | '!=' | '<' | '<=' | '>' | '>=' | '~';
}

/**
 * Search property filters (executed via search engine):
 * - string filter (fuzziness applies)
 * - numerical filter (only supported when the search vendor is Elasticsearch)
 */
type SearchPropertyFilter = NumberSearchPropertyFilter | StringSearchPropertyFilter;

interface BaseSearchPropertyFilter extends BasePropertyFilter {
  // null means "any property"
  readonly propertyKey: string | null;
}

// these property filters are only supported with Elasticsearch
interface NumberSearchPropertyFilter extends BaseSearchPropertyFilter {
  readonly propertyType: 'number';
  readonly propertyKey: string;
  // "number" search property filters cannot use the "fuzzy match" ("~") operator.
  readonly operator: Exclude<BasePropertyFilter['operator'], '~'>;
  readonly input: QueryProperty<number>;
}

// this is the fuzzy string property match that is supported by all search vendors.
interface StringSearchPropertyFilter extends BaseSearchPropertyFilter {
  readonly propertyType: 'string';
  readonly operator: '~';
  readonly input: QueryProperty<string>;
}

/**
 * Strict property filters (executed via the graph database).
 * Supported filters:
 * - string filter
 * - numerical filter
 */
export type StrictPropertyFilter = StringStrictPropertyFilter | NumberStrictPropertyFilter;

interface BaseStrictPropertyFilter<T> extends BasePropertyFilter {
  readonly propertyKey: string;
  readonly operator: Exclude<BasePropertyFilter['operator'], '~'>;
  readonly input: QueryProperty<T>;
}

export interface StringStrictPropertyFilter extends BaseStrictPropertyFilter<string[]> {
  readonly propertyType: 'string';
  readonly operator: '=' | '!=';
}

export interface NumberStrictPropertyFilter extends BaseStrictPropertyFilter<number> {
  readonly propertyType: 'number';
  readonly operator: '>' | '<' | '=' | '<=' | '>=' | '!=';
}

type QueryProperty<T> = QueryPropertyValue<T> | QueryPropertyTemplate;

interface BaseQueryProperty {
  readonly type: 'value' | 'template';
}

interface QueryPropertyValue<T> extends BaseQueryProperty {
  readonly type: 'value';
  readonly value: T;
}

interface QueryPropertyTemplate extends BaseQueryProperty {
  readonly type: 'template';
  // TODO
}
