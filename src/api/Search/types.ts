/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {IDataSourceParams, IGetSubGraphParams} from '../commonTypes';
import {LkEdge, LkNode} from '../graphItemTypes';
import {EntityType} from '../GraphSchema';

export enum IndexationStatus {
  ONGOING = 'ongoing',
  DONE = 'done',
  NEEDED = 'needed'
}

export interface GetIndexationStatusResponse {
  indexing: IndexationStatus;
  indexingProgress?: string;
  indexingStatus: string;
  nodeCount?: number;
  edgeCount?: number;
  indexSize?: number;
  indexedSource?: string;
}

export interface ISearchParams extends IDataSourceParams {
  type: EntityType;
  q: string;
  fuzziness?: number;
  size?: number;
  from?: number;
  categoriesOrTypes?: string[];
  filter?: Array<[string, string]>;
}

export interface SearchResponse {
  type: EntityType;
  totalHits?: number; // one among totalHits and moreResults is defined
  moreResults?: boolean;
  results: Array<LkNode | LkEdge>;
}

export interface ISearchFullParams extends IGetSubGraphParams, ISearchParams {}

export enum SearchSyntaxErrorKey {
  /**
   * 1. Error to check looping over the raw statements
   */

  // Common to all statements:
  // When there is no value part in the statement
  EMPTY_STATEMENT = 'empty-statement',

  // Fuzzy-statement:
  // When fuzzy value is not an integer between 1 and 100
  INVALID_FUZZINESS = 'invalid-fuzziness',
  // When there are more than two fuzzy statements /
  SEVERAL_FUZZINESS = 'several_fuzziness',

  // Scope-statement:
  // When scope value is not in SearchQueryScope
  INVALID_SCOPE = 'invalid_scope',
  // When scope value already exists and is different
  CONFLICTING_SCOPES = 'conflicting_scopes',
  // When either nodes or edges
  EDGES_NOT_SEARCHABLE = 'edges_not_searchable',

  // Type-statement:
  // When type value is comparator, range or parentheses
  INVALID_TYPE = 'invalid-type',
  // When type value already exists and is different
  INCOMPATIBLE_TYPE_STATEMENTS = 'incompatible-type-statements',

  // Property-statement's value
  // Unsupported operator (more of an unsupported filter)
  UNSUPPORTED_OPERATOR = 'unsupported-operator', // Not thrown in validator but in vendor

  /**
   * 2. Errors to check after all the statements have been validated, because they depend on other statement
   */

  // Type-statement's value (depends on scope-statement)
  // When node category does not exist in schema
  NODE_TYPE_NOT_FOUND = 'node-type-not-found',
  // When node category is not searchable
  NODE_TYPE_NOT_SEARCHABLE = 'node-type-not-searchable',
  // edge type does not exist in schema
  EDGE_TYPE_NOT_FOUND = 'edge-type-not-found',
  // When node category is not searchable
  EDGE_TYPE_NOT_SEARCHABLE = 'edge-type-not-searchable',

  // Property-statement (depends on scope-statement and type-statement)
  // When property is not in schema with/without itemType
  PROPERTY_NOT_FOUND = 'property-not-found',
  // When property is not searchable with/without itemType
  PROPERTY_NOT_SEARCHABLE = 'property-not-searchable',
  // When comparison operator is used with a property that is not a number (or date, and same for ranges)
  COMPARATOR_TYPE_MISMATCH = 'comparator-type-mismatch',
  // When comparison operator with invalid number (or date, and same for ranges)
  COMPARATOR_WITH_STRING = 'comparator-with-string',

  // SearchQuery
  // When there is no term or phrase, and there's at least other statement
  EMPTY_SEARCH = 'empty-search',

  /**
   * 3. Any other error
   */
  // When the grammar is invalid or any other unexpected error
  SYNTAX_ERROR = 'syntax_error'
}

export type SearchSyntaxError = {
  errorKey: SearchSyntaxErrorKey;
  offset: [number, number]; // start and end index to highlight
};
