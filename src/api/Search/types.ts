/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {GenericObject, IDataSourceParams, IGetSubGraphParams} from '../commonTypes';
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
  categoriesOrTypes?: [string];
  filter?: Array<[string, string]>;
}

export interface SearchResponse {
  searchQuery: SearchQuery;
  type: EntityType;
  totalHits?: number; // one among totalHits and moreResults is defined
  moreResults?: boolean;
  results: Array<LkNode | LkEdge>;
}

export interface ISearchFullParams extends IGetSubGraphParams, ISearchParams {}

export enum SearchSyntaxErrorKey {
  /**
   * 1. Detectable errors by checking one statement
   */

  // Fuzzy-statement:
  // When fuzzy value is not an integer between 1 and 100
  INVALID_FUZZINESS = 'invalid-fuzziness',
  // When there are more than two fuzzy statements /
  SEVERAL_FUZZINESS = 'several-fuzziness',

  // Scope-statement:
  // When scope value is not in SearchQueryScope
  INVALID_SCOPE = 'invalid-scope',
  // When scope value already exists and is different
  CONFLICTING_SCOPES = 'conflicting-scopes',
  // When either nodes or edges are not searchable
  EDGES_NOT_SEARCHABLE = 'edges-not-searchable',

  // Type-statement:
  // When type value already exists and is different
  INCOMPATIBLE_TYPE_STATEMENTS = 'incompatible-type-statements',

  // Property-statement's value
  // Unsupported operator (not thrown in validator but in vendor)
  UNSUPPORTED_OPERATOR = 'unsupported-operator',

  /**
   * 2. Detectable errors by checking two statements
   */

  // Type-statement's value (depends on scope-statement)
  // When node category does not exist in schema, or when type value is comparator, range or parentheses
  NODE_TYPE_NOT_FOUND = 'node-type-not-found',
  // When edge type does not exist in schema, or when type value is comparator, range or parentheses
  EDGE_TYPE_NOT_FOUND = 'edge-type-not-found',
  // When node category is not searchable
  NODE_TYPE_NOT_SEARCHABLE = 'node-type-not-searchable',
  // When edge type is not searchable
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
  // When there is no term or phrase, and there's at least another statement
  EMPTY_SEARCH = 'empty-search',

  /**
   * 3. Any other error
   */
  // When the grammar is invalid or any other unexpected error
  SYNTAX_ERROR = 'syntax-error'
}

export type SearchSyntaxError = {
  offset: [number, number]; // start and end index to highlight
} & (
  | {
      errorKey:
        | SearchSyntaxErrorKey.SEVERAL_FUZZINESS
        | SearchSyntaxErrorKey.CONFLICTING_SCOPES
        | SearchSyntaxErrorKey.EDGES_NOT_SEARCHABLE
        | SearchSyntaxErrorKey.INCOMPATIBLE_TYPE_STATEMENTS
        | SearchSyntaxErrorKey.UNSUPPORTED_OPERATOR
        | SearchSyntaxErrorKey.EMPTY_SEARCH
        | SearchSyntaxErrorKey.SYNTAX_ERROR;
    }
  | {
      errorKey: SearchSyntaxErrorKey.COMPARATOR_TYPE_MISMATCH;
      filterType: 'numerical' | 'date';
      propertyKey: string;
      propertyType: string;
      entityType: EntityType;
      itemType: string;
    }
  | {
      errorKey: SearchSyntaxErrorKey.COMPARATOR_WITH_STRING;
      filterType: 'numerical' | 'date';
      propertyValue: string;
    }
  | {
      errorKey:
        | SearchSyntaxErrorKey.EDGE_TYPE_NOT_FOUND
        | SearchSyntaxErrorKey.EDGE_TYPE_NOT_SEARCHABLE
        | SearchSyntaxErrorKey.NODE_TYPE_NOT_FOUND
        | SearchSyntaxErrorKey.NODE_TYPE_NOT_SEARCHABLE;
      itemType: string;
    }
  | {
      errorKey: SearchSyntaxErrorKey.INVALID_FUZZINESS | SearchSyntaxErrorKey.INVALID_SCOPE;
      propertyValue: string;
    }
  | {
      errorKey:
        | SearchSyntaxErrorKey.PROPERTY_NOT_FOUND
        | SearchSyntaxErrorKey.PROPERTY_NOT_SEARCHABLE;
      propertyKey: string;
      entityType: EntityType;
      itemType: string;
    }
);

export type FilterStatement =
  | {
      key: string;
      min: string | number; // `string` for dates
      max: string | number; // `string` for dates
    }
  | {
      key: string;
      min: string | number;
    }
  | {
      key: string;
      max: string | number;
    };

export interface TermStatement {
  key?: string;
  term: string;
  prefix: boolean;
}

export interface PhraseStatement {
  key?: string;
  phrase: string;
  prefix: boolean;
}

export interface SearchQuery {
  fuzziness: number;
  entityType: EntityType;
  itemTypes: GenericObject<{
    properties: string[];
    terms: TermStatement[];
    phrases: PhraseStatement[];
    filters: FilterStatement[];
  }>;
}
